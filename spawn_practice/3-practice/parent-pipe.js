const { spawn } = require('node:child_process');

const childA = spawn('node', ['child-a.js'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

const childB = spawn('node', ['child-b.js'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

childA.stdout.pipe(childB.stdin);

childB.stdout.on('data', (chunk) => {
  process.stdout.write(`[PADRE ve salida de hijo B] ${chunk}`);
});

childA.on('close', (code) => {
  console.log(`[PADRE] A terminó code=${code}`);
});

childB.on('close', (code) => {
  console.log(`[PADRE] B terminó code=${code}`);
});

childA.on('error', (err) => console.error('Error en A:', err));
childB.on('error', (err) => console.error('Error en B:', err));
childB.stdin.on('error', (err) => console.error('Error en stdin de B:', err));