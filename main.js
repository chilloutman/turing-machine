
(function () {
  "use strict";

  var transitions = {};

  // Initial State
  transitions['start'] = {
    '0': new Transition('q0', '.', Tape.Right),
    '1': new Transition('clear-right', '.', Tape.Right)
  };

  // Clears the tape from the current position towards the right.
  transitions['clear-right'] = {
    '0': new Transition('clear-right', '.', Tape.Right),
    '.': new Transition('end', '.', Tape.Right)
  };

  // Clears the tape from the current position towards the left.
  transitions['clear-left'] = {
    '0': new Transition('clear-left', '.', Tape.Left),
    '1': new Transition('clear-left', '.', Tape.Left),
    '.': new Transition('end', '.', Tape.Left)
  };

  transitions['qc'] = {
    '0': new Transition('qc', '0', Tape.Right),
    '.': new Transition('qcf', '.', Tape.Left),
    'b': new Transition('qc', '0', Tape.Right)
  };

  transitions['q0'] = {
    '0': new Transition('q1', '.', Tape.Right),
    '1': new Transition('qc', '.', Tape.Right)
  };

  transitions['q1'] = {
    '0': new Transition('q1', '0', Tape.Right),
    '1': new Transition('q2', '1', Tape.Right)
  };

  transitions['q2'] = {
    '0': new Transition('q3', 'a', Tape.Right),
    '.': new Transition('clear-left', '.', Tape.Left)
  };

  transitions['q3'] = {
    '0': new Transition('q3', '0', Tape.Right),
    'b': new Transition('q3', 'b', Tape.Right),
    '.': new Transition('q4', 'b', Tape.Left)
  };

  transitions['q4'] = {
    '0': new Transition('q4', '0', Tape.Left),
    'b': new Transition('q4', 'b', Tape.Left),
    'a': new Transition('q5', '0', Tape.Right)
  };

  transitions['q5'] = {
    '0': new Transition('q3', 'a', Tape.Right),
    'b': new Transition('q6', 'b', Tape.Left),
  };

  transitions['q6'] = {
    '0': new Transition('q6', '0', Tape.Left),
    '1': new Transition('q6', '1', Tape.Left),
    '.': new Transition('q0', '.', Tape.Right),
  };

  runTests();

  function runTests () {
    var tests = {
      '1': '',
      '01000': '000',
      '0010': '00',
      '0001000': '000000000',
      '0001': ''
    };

    for (var input in tests) {
      if (!tests.hasOwnProperty(input)) {
        continue;
      }
      var tape = new Tape(input);
      var m = new Machine(tape, transitions, 'start', ['end']);
      m.stepAll();

      var message = ['input: ' + input, 'expected: ' + tests[input], 'actual: ' + tape.contents()].join(', ');
      if (tests[input] === tape.contents()) {
        console.log(message);
      } else {
        console.error(message)
      }
    }

  }

})();
