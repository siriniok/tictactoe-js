const prompt = require('syncprompt');

const display = require('./utils/display');

const {Board, BoardInvalidRequest} = require('./Board');
const Rules = require('./Rules');

class Game {
  constructor() {
    this._board = new Board();
    this._players = ['X', '0'];
    this._currentPlayer = null;
    this._over = false;

    this._index = 0;
  }

  play() {
    while(true) {
      this._startNewTurn();
      this._displayBoard();
      this._move();

      this._checkForWin(() => display(`${this.currentPlayer} wins!`));
      this._checkForDraw(() => display("It's a draw!"));

      if(this.isOver) return;
    }
  }

  get board() { return this._board; }
  get players() { return this._players; }
  get currentPlayer() { return this._currentPlayer; }
  get isOver() { return this._over; }

  finishGame() { this._over = true; }

  _startNewTurn() {
    function nextItem(list) {
      if(this._index < list.length) this._index++;
      else this._index = 1;

      return list[this._index - 1];
    }

    this._currentPlayer = nextItem.call(this, this.players);
  }

  _displayBoard() {
    display(this.board);
  }

  _move() {
    const [row, col] = this._moveInput();
    console.log();

    try {
      return this.board.setMark(row, col, this.currentPlayer);
    } catch (e) {
      if(e instanceof BoardInvalidRequest) display(e.message, true);
      else throw e;

      return this._move();
    }
  }

  _moveInput() {
    return prompt('>> ').trim().split(' ').map(c => Number(c));
  }
}

Object.assign(Game.prototype, Rules);

module.exports = Game;
