const { spawn } = require('node:child_process');

const child = spawn('node', ['child-print.js'], {
  stdio: ['ignore', 'pipe', 'pipe'] // no usamos stdin del hijo
});

child.stdout.on("data", (chunk) => {
  process.stdout.write(`[PADRE recibe stdout] ${chunk}`);
});

child.stderr.on("data", (chunk) => {
  process.stderr.write(`[PADRE recibe stderr] ${chunk}`);
});

child.on("error", (err) => {
  console.error("[PADRE] Error al crear/ejecutar hijo:", err);
});

child.on("close", (code, signal) => {
  console.log(`[PADRE] Hijo terminó. code=${code}, signal=${signal}`);
});