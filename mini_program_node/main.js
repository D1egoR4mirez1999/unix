const { stdin, stdout, stderr } = require("node:process");

stdin.once("data", (data) => {
  stdout.write("You wrote: " + data + "\n");
  stdin.destroy();
});

console.error("Error: This is an error message");
console.log("Log: This is a log message");
