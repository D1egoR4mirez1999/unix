const { spawn, exec } = require("node:child_process");
// const { stdin, stdout, stderr } = require("node:process");

// stdin.on("data", (data) => {
//   console.log("You wrote: ", data.toString());
// });

// stdout.write("Hello, what's your name? ");
// stderr.write("Error: ");

// echo "something string" | tr ' ' '\n'

const subprocess = spawn(
  "./playground",
  ["some string", "-f", 34, "some more string", "-u"],
  {
    env: { MODE: "development" },
  }
);

subprocess.stdout.on("data", (data) => {
  console.log("Output from the C application: ", data.toString("utf-8"));
});

subprocess.stderr.on("data", (data) => {
  console.log("Error from the C application: ", data.toString("utf-8"));
});

subprocess.stdin.write("Some text on stdin from Node.js application.");
subprocess.stdin.on("error", (error) => {
  console.log("Error from the Node.js application: ", error.toString());
});
subprocess.stdin.end();

// exec(
//   " source .bashrc && echo 'something string' | tr ' ' '\n'",
//   {
//     shell: "/bin/zsh",
//   },
//   (error, stdout, stderr) => {
//     if (error) {
//       console.error(error);
//       return;
//     }

//     console.log(stdout);

//     console.log(`stderr: ${stderr}`);
//   }
// );
