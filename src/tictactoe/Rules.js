module.exports = {
  _checkForWin(notifier = null) {
    this._isWin() && this._finalize(notifier);
  },

  _checkForDraw(notifier = null) {
    this._isDraw() && this._finalize(notifier);
  },

  _finalize(notifier = null) {
    notifier && notifier();
    this.finishGame();
  },

  _isWin() {
    const lastMove = this.board.lastMove;

    if(!lastMove) return false;

    return this.board.intersectingLines(...lastMove)
      .some(line => this._isCompleteLine(line, this.currentPlayer));
  },

  _isDraw() {
    return this.board.isCovered;
  },

  _isCompleteLine(line, playerMark) {
    return line.every(mark => mark === playerMark);
  }
}
