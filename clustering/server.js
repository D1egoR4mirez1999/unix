const cpeak = require("cpeak");

const server = new cpeak();

process.on("message", (message) => {
  // console.log(
  //   `Worker ${process.pid} received this message from parent: ${message}`
  // );
});

// process.send(`${process.pid} is ready`);

server.route("get", "/", (req, res) => {
  res.json({ message: "This is some text." });
});

server.route("get", "/heavy", (req, res) => {
  for (let i = 0; i < 10000000000; i++) {}
  res.json({ message: "The operation is now done." });
});

const PORT = 5090;

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
