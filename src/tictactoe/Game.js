const prompt = require('syncprompt');

const {Board, BoardInvalidRequest} = require('./Board');

const ERROR_MSG_COLOR = 31; // Red

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

      this._checkForWin(() => this.display(`${this.currentPlayer} wins!`));
      this._checkForDraw(() => this.display("It's a draw!"));

      if(this.isOver) return;
    }
  }

  get board() { return this._board; }
  get players() { return this._players; }
  get currentPlayer() { return this._currentPlayer; }
  get isOver() { return this._over; }

  finishGame() { this._over = true; }

  display(msg, err=false) {
    console.log(`${err ? this._wrapErrorMsg(msg) : msg}\n`);
  }

  _wrapErrorMsg(msg) {
    return `\x1b[${ERROR_MSG_COLOR}m${msg}\x1b[0m`;
  }

  _startNewTurn() {
    function nextItem(list) {
      if(this._index < list.length) this._index++;
      else this._index = 1;

      return list[this._index - 1];
    }

    this._currentPlayer = nextItem.call(this, this.players);
  }

  _displayBoard() {
    this.display(this.board);
  }

  _move() {
    const [row, col] = this._moveInput();
    console.log();

    try {
      return this.board.setMark(row, col, this.currentPlayer);
    } catch (e) {
      if(e instanceof BoardInvalidRequest) this.display(e.message, true);
      else throw e;

      return this._move();
    }
  }

  _moveInput() {
    return prompt('>> ').trim().split(' ').map(c => Number(c));
  }
  
  _checkForWin(notifier = null) {
    if(this._isWin) {
      notifier();
      this.finishGame();
    }
  }

  _checkForDraw(notifier = null) {
    if(this._isDraw) {
      notifier();
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
