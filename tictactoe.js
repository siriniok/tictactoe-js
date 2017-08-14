const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n>> '
});

function nextItem(list) {
  if(this.index < list.length) this.index++;
  else this.index = 1;

  return list[this.index -1];
}

const board = [[null, null, null],
               [null, null, null],
               [null, null, null]];

const players = ['x', 'o'];
let currentPlayer = null;

function drawBoard() {
  currentPlayer = nextItem(players);
  console.log(board.map(row => row.map(e => e || ' ').join('|')).join('\n'));

  rl.prompt();
}

drawBoard();

rl.on('line', (line) => {
  const [row, col] = line.split(' ').map(e => Number(e));
  console.log('\n');
  board[row][col] = currentPlayer;
  drawBoard();
});
