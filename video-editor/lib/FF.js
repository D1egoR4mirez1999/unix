const { spawn } = require("node:child_process");

const makeThumbnail = (fullPath, thumbnailPath) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-ss",
      "5",
      "-vframes",
      "1",
      thumbnailPath
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });

    ffmpeg.on("error", () => {
      reject("An error has occured creating the thumbnail");
    });
  });
};

const getDimensions = (fullPath) => {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0",
      fullPath
    ]);

    let dimensions = "";
    ffprobe.stdout.on("data", (chunk) => {
      dimensions = dimensions + chunk;
    });

    ffprobe.on("close", (code) => {
      if (code === 0) {
        const [width, height] = dimensions.toString("utf8").trim().split(",");
        resolve({
          width,
          height,
        });
      } else {
        reject();
      }
    });
  });
};

const extractAudio = (fullPath, targetPath) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      fullPath,
      "-vn",
      "-c:a",
      "copy",
      targetPath
    ]);

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });

    ffmpeg.on("error", () => {
      reject("An error has occured extracting the audio");
    });
  });
};

const resizeVideo = (videoPath, targetPath, width, height) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      videoPath,
      "-vf",
      `scale=${width}:${height}`,
      "-c:a",
      "copy",
      "-threads",
      "4",
      "-loglevel",
      "error",
      "-y",
      targetPath
    ]);

    ffmpeg.on("close", (code) => {
      if (code !== 0) {
        return reject();
      }
      resolve();
    });
    
    ffmpeg.on("error", () => {
      reject("Something went wrong resizing the video");
    });
  });
};

const controller = {
  makeThumbnail,
  getDimensions,
  extractAudio,
  resizeVideo,
}

module.exports = controller;