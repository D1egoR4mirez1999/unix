const cluster = require("node:cluster");
const os = require("node:os");

if (cluster.isPrimary) {
  os.cpus().forEach(() => {
    const worker = cluster.fork();
    // worker.send("some data");
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died, respawning...`);
    cluster.fork();
  });

  // cluster.on("message", (worker, message) => {
  //   console.log(`worker ${worker.process.pid} sent message: ${message}`);
  // });
} else {
  require("./server.js");
}