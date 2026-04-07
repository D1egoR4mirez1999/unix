let data = '';

process.stdin.on('data', (chunk) => {
  data += chunk;
});

process.stdin.on('end', () => {
  process.stdout.write(
    `Hijo recibió (${data.length} chars): ${data.toUpperCase()}`
  );
});

process.stdin.on('error', (err) => {
  process.stderr.write(`[HIJO] Error al leer stdin: ${err}`);
});