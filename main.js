
(function () {
  "use strict";

  var machine;
  var spec = Multiplication;
  var timeout;

  window.onload = function () {
    clearMachine();

    document.getElementById('stepButton').addEventListener('click', function () {
      step();
    });

    document.getElementById('stepAllButton').addEventListener('click', function () {
      stepAll();
    });

    document.getElementById('stepAllFastButton').addEventListener('click', function () {
      stepAll(true);
    });

    document.getElementById('clearButton').addEventListener('click', clearMachine);
  };

  function getMachine() {
    if (!machine) {
      machine = new Machine(newTape(spec), spec.transitions, 'start', ['end']);
    }
    return machine;
  }

  function newTape(spec) {
    var input = spec.encodeInput(getInput('x'), getInput('y'));
    return new Tape(input);
  }

  function clearMachine() {
    clearTimeout(timeout);
    machine = null;
    update(true);
  }

  function step() {
    var didTransition = getMachine().step(true);
    update(!didTransition);
    return didTransition;
  }

  function stepAll(fast) {
    clearMachine();

    if (fast) {
      // Go as fast as possible and only show the end result.
      getMachine().verbose = false;
      getMachine().stepAll(false);
      update(true);
    } else {
      // Go slower and show every step.
      var stepAllStep = function () {
        if (step(true)) {
          timeout = setTimeout(stepAllStep, 50);
        }
      };
      timeout = setTimeout(stepAllStep, 50);
    }
  }

  function update(alsoUpdateResult) {
    drawTape();
    updateState();
    if (alsoUpdateResult) {
      updateResult();
    }
  }

  function updateState() {
    document.getElementById('state').textContent = machine? machine.state : '';
  }

  function updateResult() {
    var resultElement = document.getElementById('result');
    resultElement.textContent = machine ? machine.tape.contents().length : '?';
  }

  function drawTape() {
    clearTape();
    if (machine) {
      var tapeElement = document.getElementById('tape');
      var cells = tapeElement.children;
      var values = valuesToRender(machine.tape);
      for (var i = 0; i < cells.length; i++) {
        cells[i].textContent = values[i] ? values[i] : '.';
      }
    }
  }

  function clearTape() {
    var tapeElement = document.getElementById('tape');
    var cells = tapeElement.children;
    for (var i = 0; i < cells.length; i++) {
      cells[i].textContent = '.';
    }
  }

  function valuesToRender(tape) {
    var values = tape.cells.slice();
    if (tape.position > 15) {
      values = values.slice(tape.position - 16, values.length - 1);
    }
    for (var i = 0; i < 15 - tape.position; i++) {
      values.unshift('.');
    }
    return values;
  }

  function getInput(id) {
    return document.getElementById(id).value;
  }

  //runTests();

  function runTests() {
    var tests = {
      '1': '',
      '01000': '000',
      '0010': '00',
      '0001000': '000000000',
      '0001': ''
    };

    for (var input in tests) {
      if (tests.hasOwnProperty(input)) {
        var tape = new Tape(input);
        var m = new Machine(tape, Multiplication.transitions, 'start', ['end']);
        m.stepAll();

        var message = ['input: ' + input, 'expected: ' + tests[input], 'actual: ' + tape.contents()].join(', ');
        if (tests[input] === tape.contents()) {
          console.log(message);
        } else {
          console.error(message);
        }
      }
    }

  }

})();
