class BoardInvalidRequest extends Error {
  constructor(msg, ...args) {
    super(msg, ...args);

    Object.defineProperty(this, 'name', {
      get: () => this.constructor.name
    });
    Object.defineProperty(this, 'message', {
      get: () => msg || 'Position is not correct'
    });

    Error.captureStackTrace(this, this.constructor);
  }
}

const LEFT_DIAGONAL_POSITIONS  = [[0,0], [1,1], [2,2]];
const RIGHT_DIAGONAL_POSITIONS = [[2,0], [1,1], [0,2]];
const SPAN                     = [0, 1, 2];
const BOARD_SIZE               = 3;
const CELL_COUNT               = BOARD_SIZE * BOARD_SIZE;

class Board {
  constructor() {
    this._data = [[null, null, null],  // [[0,0], [0,1], [0,2]]
                  [null, null, null],  // [[1,0], [1,1], [2,2]]
                  [null, null, null]]; // [[2,0], [2,1], [2,2]]

    this._lastMove = null;
  }

  get lastMove() { return this._lastMove; }

  getMark(row, col) {
    if(!this.isValidPosition(row, col))
      throw new BoardInvalidRequest('Position is not within the board');

    return this._data[row][col];
  }

  setMark(row, col, mark) {
    if(this.getMark(row, col))
      throw new BoardInvalidRequest('Position is already occupied');

    this._data[row][col] = mark;
    return this._lastMove = [row, col];
  }

  isValidPosition(row, col) {
    if((Number.isInteger(row) && Number.isInteger(col)) &&
       (row >= 0 && row < BOARD_SIZE) &&
       (col >= 0 && col < BOARD_SIZE)) {
      return true;
    }

    return false;
  }

  toString() {
    return this._data.map(row => row.map(c => c || ' ').join('|')).join('\n');
  }

  intersectingLines(r, c) {
    return [
      this.leftDiagonal(),
      this.rightDiagonal(),
      this.row(r),
      this.column(c)
    ]
  }

  get isCovered() {
    return this.marksCount == CELL_COUNT;
  }

  leftDiagonal() {
    return LEFT_DIAGONAL_POSITIONS.map(c => this.getMark(...c));
  }

  rightDiagonal() {
    return RIGHT_DIAGONAL_POSITIONS.map(c => this.getMark(...c));
  }

  row(index) {
    return SPAN.map(col => this.getMark(index, col));
  }

  column(index) {
    return SPAN.map(row => this.getMark(row, index));
  }

  get marksCount() {
    return this.flattenBoard().filter(cell => cell).length;
  }
  
  flattenBoard() {
    return this._data.reduce((a, b) => a.concat(b), []);
  }
}

module.exports.Board = Board;
module.exports.BoardInvalidRequest = BoardInvalidRequest;
