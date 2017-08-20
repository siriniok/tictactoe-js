const prompt = require('syncprompt');

function nextItem(list) {
  if(this.index < list.length) this.index++;
  else this.index = 1;

  return list[this.index - 1];
}

const board = [[null, null, null],
               [null, null, null],
               [null, null, null]];

const players = ['x', 'o'];

let currentPlayer = nextItem(players);

while(true) {
  console.log(board.map(row => row.map(e => e || ' ').join('|')).join('\n'));

  const [row, col] = prompt('>> ').trim().split(' ').map(e => Number(e));

  if((row < 0 || row >= board.length) ||
     (col < 0 || col >= board[row].length)) {
    console.log('Out of bounds, try another position');
    continue;
  }

  if(board[row][col]) {
    console.log('Cell occupied, try another position');
    continue;
  }

  board[row][col] = currentPlayer;
  console.log('\n');

  currentPlayer = nextItem(players);
}
