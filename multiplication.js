
Multiplication = (function () {
  var Multiplication = {};

  Multiplication.encodeInput = function (x, y) {
    checkNumberInput(x);
    checkNumberInput(y);

    return toUnaryValue(x) + '1' + toUnaryValue(y);
  };

  function checkNumberInput(input) {
    if (!input) {
      throw new Error('Input is missing!');
    }

    if (input < 0) {
      throw new Error('Input is invalid: ' + input);
    }
  }

  function toUnaryValue(input) {
    var unaryValue = '';
    for (var i = 0; i < input; i++) {
      unaryValue += '0';
    }
    return unaryValue;
  }

  Multiplication.transitions = {};

  // Initial State
  Multiplication.transitions['start'] = {
    '0': new Transition('q0', '.', Tape.Right),
    '1': new Transition('clear-right', '.', Tape.Right)
  };

  // Clears the tape from the current position towards the right.
  Multiplication.transitions['clear-right'] = {
    '0': new Transition('clear-right', '.', Tape.Right),
    '.': new Transition('end', '.', Tape.Right)
  };

  // Clears the tape from the current position towards the left.
  Multiplication.transitions['clear-left'] = {
    '0': new Transition('clear-left', '.', Tape.Left),
    '1': new Transition('clear-left', '.', Tape.Left),
    '.': new Transition('end', '.', Tape.Right)
  };

  Multiplication.transitions['qc'] = {
    '0': new Transition('qc', '0', Tape.Right),
    '.': new Transition('end', '.', Tape.Right),
    'b': new Transition('qc', '0', Tape.Right)
  };

  Multiplication.transitions['q0'] = {
    '0': new Transition('q1', '.', Tape.Right),
    '1': new Transition('qc', '.', Tape.Right)
  };

  Multiplication.transitions['q1'] = {
    '0': new Transition('q1', '0', Tape.Right),
    '1': new Transition('q2', '1', Tape.Right)
  };

  Multiplication.transitions['q2'] = {
    '0': new Transition('q3', 'a', Tape.Right),
    '.': new Transition('clear-left', '.', Tape.Left)
  };

  Multiplication.transitions['q3'] = {
    '0': new Transition('q3', '0', Tape.Right),
    'b': new Transition('q3', 'b', Tape.Right),
    '.': new Transition('q4', 'b', Tape.Left)
  };

  Multiplication.transitions['q4'] = {
    '0': new Transition('q4', '0', Tape.Left),
    'b': new Transition('q4', 'b', Tape.Left),
    'a': new Transition('q5', '0', Tape.Right)
  };

  Multiplication.transitions['q5'] = {
    '0': new Transition('q3', 'a', Tape.Right),
    'b': new Transition('q6', 'b', Tape.Left),
  };

  Multiplication.transitions['q6'] = {
    '0': new Transition('q6', '0', Tape.Left),
    '1': new Transition('q6', '1', Tape.Left),
    '.': new Transition('q0', '.', Tape.Right),
  };

  return Multiplication;
})();
