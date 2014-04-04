
(function () {
  "use strict";

  var machine;
  var spec = Multiplication;


  window.onload = function () {
    clearMachine();

    document.getElementById('stepButton').addEventListener('click', function () {
      step();
    });

    document.getElementById('stepAllButton').addEventListener('click', function () {
      stepAll();
    });

    document.getElementById('clearButton').addEventListener('click', clearMachine);
  };

  function getMachine() {
    if (!machine) {
      machine = new Machine(newTape(spec), spec.transitions, 'start', ['end']);
    }
    return machine;
  }

  function newTape (spec) {
    var input = spec.encodeInput(getInput('x'), getInput('y'));
    return new Tape(input);
  }

  function clearMachine() {
    machine = null;
    drawTape();
  }

  function step() {
    var didTransition = getMachine().step();
    drawTape();
    if (!didTransition) {
      displayResult();
    }
    return didTransition;
  }

  function stepAll() {
    clearMachine();

    var stepAllStep = function () {
      if (step()) {
        setTimeout(stepAllStep, 100);
      }
    };
    setTimeout(stepAllStep, 100);
  }

  function displayResult() {
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

  function getInput (id) {
    return document.getElementById(id).value;
  }

  //runTests();

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
      var m = new Machine(tape, Multiplication.transitions, 'start', ['end']);
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
