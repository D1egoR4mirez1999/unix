const { stdin, stdout, stderr } = require('node:process');
const fs = require('node:fs');

stdin.on('data', (chunk) => {
  stdout.write(chunk.toString('utf-8'));
});

const args = process.argv.slice(2);
const command = args[0];

if (command) {
  const fileStream = fs.createReadStream(command);

  fileStream.pipe(stdout);
  fileStream.on('end', () => {
    stdout.write('\n');
    process.exit(0);
  });
}