const path = require("node:path");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const { pipeline } = require("node:stream/promises");
const cluster = require("node:cluster");

const DB = require("../DB");
const FF = require("../../lib/FF");
const Util = require("../../lib/util");

let jobQueue = null;
if (cluster.isPrimary) {
  const JobQueue = require("../../lib/JobQueue");
  jobQueue = new JobQueue();
}

const getVideos = async (req, res, handleErr) => {
  DB.update();
  const videos = DB.videos.filter((video) => req.userId === video.userId);
  res.status(200).json(videos ?? []);
};

const uploadVideo = async (req, res, handleErr) => {
  const specifiedFileName = req.headers.filename;
  const extension = path.extname(specifiedFileName).substring(1).toLocaleLowerCase();
  const name = path.parse(specifiedFileName).name;
  const videoId = crypto.randomBytes(4).toString("hex");
  const FORMATS_SUPPORTED = ["mp4", "mov"];

  if (FORMATS_SUPPORTED.indexOf(extension) === -1) {
    return handleErr({
      status: 400,
      message: "Only these formats are supported: mp4 - mov"
    });
  }

  try {
    await fs.mkdir(`./storage/${videoId}`);
    const fullPath = `./storage/${videoId}/original.${extension}`;
    const thumbnailPath = `./storage/${videoId}/thumbnail.jpg`;
    const fileHandler = await fs.open(fullPath, "w");
    const fileStream = fileHandler.createWriteStream();

    await pipeline(req, fileStream);

    // Create thumbnail of the video
    await FF.makeThumbnail(fullPath, thumbnailPath);

    // Get the dimensions of the video
    const dimensions = await FF.getDimensions(fullPath);

    DB.update();
    DB.videos.unshift({
      id: DB.videos.length,
      videoId,
      name,
      extension,
      dimensions,
      userId: req.userId,
      extractedAudio: false,
      resizes: {}
    });
    DB.save();

    res.status(200).json({
      status: "success",
      message: "The file was uploaded successfully"
    });
  } catch (error) {
    Util.deleteFolder(`./storage/${videoId}`);
    if (error.code !== "ECONNRESET") {
      return handleErr(error);
    }
  }
};

const getVideoAsset = async (req, res, handleErr) => {
  const videoId = req.params.get("videoId");
  const type = req.params.get("type");
  let video = {};
  let filePath, mime, downloadName = "";

  if (type !== "thumbnail") {
    DB.update();
    video = DB.videos.find((video) => video.videoId === videoId);
  }

  switch (type) {
    case "thumbnail":
      filePath = `./storage/${videoId}/thumbnail.jpg`;
      mime = "image/jpg";
      const stats = await fs.stat(filePath);
      res.setHeader("Content-length", stats.size);
      break;
    case "original":
      filePath = `./storage/${videoId}/original.${video.extension}`;
      mime = "video/mp4";
      downloadName = `${video.name}.${video.extension}`;
      break;
    case "resize":
      const dimensions = req.params.get("dimensions");
      filePath = `./storage/${videoId}/${dimensions}.${video.extension}`;
      mime = "video/mp4";
      downloadName = `${video.name}-${dimensions}.${video.extension}`;
      break;
    case "audio":
      filePath = `./storage/${videoId}/audio.aac`;
      mime = "audio.acc";
      downloadName = `${video.name}-audio.aac`;
      break;
  }

  if (type !== "thumbnail") {
    res.setHeader("Content-Disposition", `attachment; filename=${downloadName}`);
  }

  const fileHandler = await fs.open(filePath, "r");
  const readStream = fileHandler.createReadStream();

  res.setHeader("Content-Type", mime);

  await pipeline(readStream, res);
  fileHandler.close();
};

const extractAudio = async (req, res, handleErr) => {
  const videoId = req.params.get("videoId");
  DB.update();
  const video = DB.videos.find((video) => video.videoId === videoId);

  if (video.extractedAudio) {
    return handleErr({
      status: 400,
      message: "The video audio has already been extracted!"
    });
  }

  const videoPath = `./storage/${video.videoId}/original.${video.extension}`;
  const targetPath = `./storage/${video.videoId}/audio.aac`;

  try {
    await FF.extractAudio(videoPath, targetPath);
    video.extractedAudio = true;
    DB.save();
    res.status(200).json({
      status: "success",
      message: "The audio has been extracted successfully!"
    });
  } catch (error) {
    Util.deleteFile(targetPath);
    return handleErr(error);
  }
};

const resizeVideo = async (req, res, handleErr) => {
  const width = Number(req.body.width);
  const height = Number(req.body.height);
  const videoId = req.body.videoId;

  DB.update();
  const video = DB.videos.find((v) => v.videoId === videoId);
  video.resizes[`${width}x${height}`] = { proccesing: true };
  DB.save();

  if (cluster.isPrimary) {
    jobQueue.enqueue({
      type: "resize",
      videoId,
      width,
      height,
    });
  }

  if (cluster.isWorker) {
    const data = {
      type: "resize",
      videoId,
      width,
      height,
    };

    process.send({
      type: "new-resize",
      data,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Resizing in progress!"
  });
};

const controller = {
  getVideos,
  uploadVideo,
  getVideoAsset,
  extractAudio,
  resizeVideo,
};

module.exports = controller;