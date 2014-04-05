
Transition = (function () {
  "use strict";

  var Transition = function (nextState, symbolToWrite, moveDirection) {
    this.nextState = nextState;
    this.symbolToWrite = symbolToWrite;
    this.moveDirection = moveDirection;
  };

  return Transition;

})();

Machine = (function () {
  "use strict";

  var Machine = function (tape, transitions, initialState, acceptingStates) {
    if (!acceptingStates || acceptingStates.length === 0) {
      throw new Error('At least one accepting state must be defined.');
    }
    if (!initialState) {
      throw new Error('An initial state must be defined.');
    }
    this.tape = tape;
    this.transitions = transitions;
    this.state = initialState;
    this.acceptingStates = acceptingStates;
    this.verbose = true;
  };

  Machine.prototype.step = function () {
    var symbol = this.tape.read();
    var transition = nextTransition(this.transitions, this.state, symbol);
    if (!transition) {
      return false;
    }
    this.tape.write(transition.symbolToWrite);
    this.tape.move(transition.moveDirection);
    this.state = transition.nextState;
    this.log();
    return true;
  };

  Machine.prototype.accept = function () {
    return this.acceptingStates.indexOf(this.state) < 0;
  };

  function nextTransition(transitions, state, symbol) {
    if (transitions[state] === undefined || transitions[state][symbol] === undefined) {
      return null;
    }
    return transitions[state][symbol];
  }

  Machine.prototype.stepAll = function () {
    this.log();
    while (this.step()) {}
  };

  Machine.prototype.toString = function () {
    return ['state: ' + this.state, 'tape: '].join(', ') + '\n' + this.tape.toString();
  };

  Machine.prototype.log = function () {
    if (this.verbose) {
      console.log(this.toString());
    }
  };

  return Machine;
})();
