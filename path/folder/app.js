const fs = require("node:fs");
const path = require("node:path")
require("./file");

const content = fs.readFileSync(path.join(__dirname, "./text.txt"), "utf8");
console.log(content)