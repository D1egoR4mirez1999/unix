const { stdin, stdout } = require('node:process');

let data = '';

stdin.on('data', (chunk) => {
  data += chunk;
});

stdin.on('end', () => {
  const numbers = data.split(' ').map(Number);
  const formattedNumbers = numbers.map(number => '$' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  stdout.write(formattedNumbers.join(' ') + '\n');
});