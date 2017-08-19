const prompt = require('syncprompt');

function nextItem(list) {
  if(this.index < list.length) this.index++;
  else this.index = 1;

  return list[this.index -1];
}

const board = [[null, null, null],
               [null, null, null],
               [null, null, null]];

const players = ['x', 'o'];

while(true) {
  let currentPlayer = nextItem(players);
  console.log(board.map(row => row.map(e => e || ' ').join('|')).join('\n'));

  const [row, col] = prompt('>> ').split(' ').map(e => Number(e));
  board[row][col] = currentPlayer;
  console.log('\n');
}
