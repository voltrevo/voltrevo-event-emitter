'use strict';

module.exports = function() {
  var sequence = {};

  sequence.elements = [];

  sequence.adder = function(value) {
    return function() {
      sequence.elements.push(value);
    };
  };

  return sequence;
};
