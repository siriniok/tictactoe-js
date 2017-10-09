const prompt = require('syncprompt');

module.exports = class Game {
  constructor() {
    this.board = [[null, null, null],
                  [null, null, null],
                  [null, null, null]];

    this.players = ['x', 'o'];
    this.currentPlayer = null;
    this._index = 0;
  }

  play() {
    this._startNewTurn();

    while(true) {
      this._displayBoard();
      const [row, col] = this._playerInput();

      if(!this._isValidMove(row, col)) continue;

      this.board[row][col] = this.currentPlayer;

      if(this._isWinningMove(row, col)) {
        console.log(`${this.currentPlayer} wins!`);
        return;
      }

      if(this._isDraw()) {
        console.log("It's a draw!");
        return;
      }

      this._startNewTurn();
    }
  }

  _startNewTurn() {
    function nextItem(list) {
      if(this._index < list.length) this._index++;
      else this._index = 1;

      return list[this._index - 1];
    }

    this.currentPlayer = nextItem.call(this, this.players);
  }

  _displayBoard() {
    console.log(this.board.map(row => row.map(c => c || ' ').join('|')).join('\n'));
  }

  _playerInput() {
    const coords = prompt('>> ').trim().split(' ').map(c => Number(c));
    console.log();
    return coords;
  }

  _isValidMove(row, col) {
    if(!(Number.isInteger(row) && Number.isInteger(col)) ||
       (row < 0 || row >= this.board.length) ||
       (col < 0 || col >= this.board[row].length)) {
      console.log('Coordinates are incorrect, try another position\n');
      return false;
    }

    if(this.board[row][col]) {
      console.log('Cell occupied, try another position\n');
      return false;
    }

    return true;
  }

  _isWinningMove(row, col) {
    const leftDiagonal = [[0,0], [1,1], [2,2]];
    const rightDiagonal = [[2,0], [1,1], [0,2]];

    let lines = [];

    [leftDiagonal, rightDiagonal].map((line) => {
      line.map((cell) => {
        if(cell[0] === row && cell[1] === col) lines.push(line);
      });
    });

    lines.push([0, 1, 2].map(c1 => [row, c1]));
    lines.push([0, 1, 2].map(r1 => [r1, col]));

    return lines.some((line) => {
      return line.every((cell) => {
        const [row, col] = cell;

        return this.board[row][col] === this.currentPlayer;
      });
    });
  }

  _isDraw() {
    return this.board.reduce((a, b) => a.concat(b), [])
      .filter(cell => cell)
      .length == 9;
  }
};
