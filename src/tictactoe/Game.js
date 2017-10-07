const prompt = require('syncprompt');

module.exports = class Game {
  constructor() {
    this.board = [[null, null, null],
                  [null, null, null],
                  [null, null, null]];

    this.players = ['x', 'o'];
  }

  play() {
    let index = 0;

    function nextItem(list) {
      if(index < list.length) index++;
      else index = 1;

      return list[index - 1];
    }

    const leftDiagonal = [[0,0], [1,1], [2,2]];
    const rightDiagonal = [[2,0], [1,1], [0,2]];

    let currentPlayer = nextItem(this.players);

    while(true) {
      console.log(this.board.map(row => row.map(e => e || ' ').join('|')).join('\n'));

      const [row, col] = prompt('>> ').trim().split(' ').map(e => Number(e));

      if(!(Number.isInteger(row) && Number.isInteger(col)) ||
        (row < 0 || row >= this.board.length) ||
        (col < 0 || col >= this.board[row].length)) {
        console.log('Coordinates are incorrect, try another position');
        continue;
      }

      if(this.board[row][col]) {
        console.log('Cell occupied, try another position');
        continue;
      }

      this.board[row][col] = currentPlayer;
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

          return this.board[row][col] === currentPlayer;
        });
      });

      if(win) {
        console.log(`${currentPlayer} wins!`);
        process.exit();
      }

      const draw = this.board.reduce((a, b) => a.concat(b), [])
        .filter(cell => cell)
        .length == 9;

      if(draw) {
        console.log("It's a draw!");
        process.exit();
      }

      currentPlayer = nextItem(this.players);
    }
  }
};
