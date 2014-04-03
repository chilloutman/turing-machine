
Tape = (function () {
  "use strict";

  var Tape = function (cells) {
    this.cells = cells ? cells.split('') : [];
    this.position = 0;
  };

  Tape.Right = 'right';
  Tape.Left = 'left';

  Tape.prototype.move = function (direction) {
    if (direction === Tape.Left) {
      this.moveLeft();
    } else if (direction === Tape.Right) {
      this.moveRight();
    } else {
      throw new Error('The tape must be moved either right or left! Direction is invalid: ' + direction);
    }
  };

  Tape.prototype.moveLeft = function () {
    console.debug('move: ' + Tape.Left);
    this.position--;
  };

  Tape.prototype.moveRight = function () {
    console.debug('move: ' + Tape.Right);
    this.position++;
  };

  Tape.prototype.read = function () {
    var symbol = this.cells[this.position] === undefined ? '.' : this.cells[this.position];
    console.debug('read: ' + symbol);
    return symbol;
  };

  Tape.prototype.write = function (symbol) {
    if (!symbol || symbol.length !== 1) {
      throw new Error('Invalid symbol cannot be written: "' + symbol + '"');
    }
    console.debug('write: ' + symbol);
    this.cells[this.position] = symbol;
  };

  Tape.prototype.toString = function () {
    return getPositionString(this.position) + '\n' + this.cells.join('');
  }

  Tape.prototype.contents = function () {
    return this.cells.join('').replace(/\./g, '');
  }

  function getPositionString (position) {
    return new Array(position).join(' ') + 'v';
  }

  return Tape;

})();
