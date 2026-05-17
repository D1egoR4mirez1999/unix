const FF = require("./FF");
const DB = require("../src/DB");
const Util = require("./util");

class JobQueue {
  constructor() {
    this.currentJob = null;
    this.jobs = [];

    DB.update();
    DB.videos.forEach((v) => {
      const keys = Object.keys(v.resizes);
      keys.forEach((key) => {
        const [width, height] = key.split("x");
        if (v.resizes[key].proccesing) {
          this.enqueue({
            type: "resize",
            videoId: v.videoId,
            width: Number(width),
            height: Number(height),
          });
        }
      });
    });
  }

  enqueue(job) {
    this.jobs.push(job);
    this.executeNext()
  }

  dequeue() {
    return this.jobs.shift();
  }

  executeNext() {
    if (this.currentJob) return;
    this.currentJob = this.dequeue();

    if (!this.currentJob) return;
    this.execute(this.currentJob);
  }

  async execute(job) {
    if (job.type === "resize") {
      const { videoId, width, height } = job;

      DB.update();
      const video = DB.videos.find((v) => v.videoId === videoId);
      const videoPath = `./storage/${video.videoId}/original.${video.extension}`;
      const targetPath = `./storage/${video.videoId}/${width}x${height}.${video.extension}`;

      try {
        await FF.resizeVideo(videoPath, targetPath, width, height);
        
        DB.update();
        const video = DB.videos.find((v) => v.videoId === videoId);
        video.resizes[`${width}x${height}`].proccesing = false;
        DB.save();
        
        this.currentJob = null;
        this.executeNext();
      } catch (error) {
        Util.deleteFile(targetPath);
      }
    }
  }
}

module.exports = JobQueue;