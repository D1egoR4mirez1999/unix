let data = '';

process.stdin.on('data', (chunk) => {
  data += chunk;
});

process.stdin.on('end', () => {
  const lines = data.trim().split('\n');
  process.stdout.write(`B recibió ${lines.length} líneas: ${JSON.stringify(lines)}\n`);
});