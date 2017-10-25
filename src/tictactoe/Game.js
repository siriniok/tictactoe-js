const prompt = require('syncprompt');

const {Board, BoardInvalidRequest} = require('./Board');

module.exports = class Game {
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

      this._checkForWin();
      this._checkForDraw();

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
    console.log(this.board.toString());
  }

  _move() {
    const [row, col] = this._moveInput();
    console.log();

    try {
      return this.board.setMark(row, col, this.currentPlayer);
    } catch (e) {
      if(e instanceof BoardInvalidRequest) console.log(`${e.message}\n`);
      else throw e;

      return this._move();
    }
  }

  _moveInput() {
    return prompt('>> ').trim().split(' ').map(c => Number(c));
  }
  
  _checkForWin() {
    if(this._isWin) {
      console.log(`${this.currentPlayer} wins!`);
      this.finishGame();
    }
  }

  _checkForDraw() {
    if(this._isDraw) {
      console.log("It's a draw!");
      this.finishGame();
    }
  }

  get _isWin() {
    const lastMove = this.board.lastMove;

    if(!lastMove) return false;

    return this.board.intersectingLines(...lastMove)
      .some(line => this._isCompleteLine(line, this.currentPlayer));
  }

  get _isDraw() {
    return this.board.isCovered;
  }

  _isCompleteLine(line, playerMark) {
    return line.every(mark => mark === playerMark);
  }
}
