const { spawn } = require('node:child_process');

const child = spawn('node', ['child-echo.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

child.stdin.on('error', () => {
  process.stderr.write('[PADRE] Error al escribir en stdin del hijo');
});

child.stdout.on('data', (chunk) => {
  process.stdout.write(`[PADRE stdout hijo] ${chunk}`)
});

child.stderr.on('data', (chunk) => {
  process.stderr.write(`[PADRE stderr hijo] ${chunk}`)
});

child.on('close', (code) => {
  console.log(`[PADRE] Hijo terminó. code=${code}`);
});

child.stdin.write('hola hijo\n');
child.stdin.write('segunda linea\n');
child.stdin.write('tercera linea\n');
child.stdin.end();