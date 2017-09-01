const prompt = require('syncprompt');

function nextItem(list) {
  if(this.index < list.length) this.index++;
  else this.index = 1;

  return list[this.index - 1];
}

const board = [[null, null, null],
               [null, null, null],
               [null, null, null]];

const leftDiagonal = [[0,0], [1,1], [2,2]];
const rightDiagonal = [[2,0], [1,1], [0,2]];

const players = ['x', 'o'];

let currentPlayer = nextItem(players);

while(true) {
  console.log(board.map(row => row.map(e => e || ' ').join('|')).join('\n'));

  const [row, col] = prompt('>> ').trim().split(' ').map(e => Number(e));

  if(!(Number.isInteger(row) && Number.isInteger(col)) ||
     (row < 0 || row >= board.length) ||
     (col < 0 || col >= board[row].length)) {
    console.log('Coordinates are incorrect, try another position');
    continue;
  }

  if(board[row][col]) {
    console.log('Cell occupied, try another position');
    continue;
  }

  board[row][col] = currentPlayer;
  console.log('\n');

  let lines = [];

  [leftDiagonal, rightDiagonal].map((line) => {
    line.map((cell) => {
      if(cell[0] === row && cell[1] === col) lines.push(line);
    });
  });

  lines.push([0, 1, 2].map(c1 => [row, c1]));
  lines.push([0, 1, 2].map(r1 => [r1, col]));

  const win = lines.some((line) => {
    return line.every((cell) => {
      const [row, col] = cell;

      return board[row][col] === currentPlayer;
    });
  });

  if(win) {
    console.log(`${currentPlayer} wins!`);
    process.exit();
  }

  const draw = board.reduce((a, b) => a.concat(b), [])
                    .filter(cell => cell)
                    .length == 9;

  if(draw) {
    console.log("It's a draw!");
    process.exit();
  }

  currentPlayer = nextItem(players);
}
