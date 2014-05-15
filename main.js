
(function () {
  "use strict";

  var machine;
  var spec = Multiplication;
  var tapeColors;
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
      determineTapeColors(spec.alphabet);
    }
    return machine;
  }

  function newTape(spec) {
    var input = spec.encodeInput(getInput('x'), getInput('y'));
    return new Tape(input);
  }

  function determineTapeColors(alphabet) {
    tapeColors = {};
    var hueDistance = 256 / (alphabet.length);
    alphabet.forEach(function (character, index) {
      var hue = hueDistance * index;
      var color = 'hsla(' + hue + ', 50%, 70%, 1)';
      tapeColors[character] = color;
    });
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
    updateTape();
    updateState();
    if (alsoUpdateResult) {
      updateResult();
    }
  }

  function updateState() {
    if (!machine) {
      document.getElementById('state').textContent = '';
    } else {
      document.getElementById('state').textContent = 'State: ' + machine.state + ', Steps: ' + machine.steps;
    }
  }

  function updateResult() {
    var resultElement = document.getElementById('result');
    resultElement.textContent = machine ? machine.tape.contents().length : '?';
  }

  function updateTape() {
    clearTape();
    if (machine) {
      var cells = document.getElementById('tape').children;
      var values = valuesToRender(machine.tape);

      updateTapeValues(cells, values);
    }

    function updateTapeValues(cells, values) {
      for (var i = 0; i < cells.length; i++) {
        var character = values[i] ? values[i] : '.';
        cells[i].textContent = character;
        cells[i].style['background-color'] = tapeColors[character];
      }
    }
  }

  function clearTape() {
    var tapeElement = document.getElementById('tape');
    var cells = tapeElement.children;
    for (var i = 0; i < cells.length; i++) {
      cells[i].textContent = '.';
      cells[i].style['background-color'] = '';
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
