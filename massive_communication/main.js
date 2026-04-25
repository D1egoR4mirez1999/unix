const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const child = spawn(
  `${path.join(__dirname, 'number-formatter')}`,
  [path.join(__dirname, 'text.txt'), '$', ',']
);

child.stdout.on('data', (chunk) => {
  console.log('Formatted number: ', chunk.toString('utf-8'));
});

child.stderr.on('data', (chunk) => {
  console.error('Error: ', chunk.toString('utf-8'));
});

const fileStream = fs.createReadStream(path.join(__dirname, 'src.txt'));

fileStream.pipe(child.stdin);

fileStream.on('error', (err) => {
  console.error('Error reading file: ', err);
});

child.on('close', (code) => {
  console.log('Child process exited with code: ', code);
});
