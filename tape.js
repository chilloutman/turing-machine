
// TODO: Implement tape expasion to the left when required.
Tape = (function () {
  "use strict";

  var Tape = function (cells) {
    this.cells = cells ? cells.split('') : [];
    this.position = 0;
  };

  Tape.Right = 1;
  Tape.Left = -1;

  Tape.prototype.move = function (direction) {
    if (Math.abs(direction) > 1) {
      throw new Error('The tape can only be moved one unit to the right or the left! Direction is invalid: ' + direction);
    }

    this.position += direction;
  };

  Tape.prototype.moveLeft = function () {
    this.position--;
  };

  Tape.prototype.moveRight = function () {
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
    return new Array(position).join(' ') + ' v';
  }

  return Tape;

})();
