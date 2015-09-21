'use strict';

module.exports = function(fn) {
  var called = false;

  return function() {
    if (called) {
      return undefined;
    }

    called = true;

    return fn.apply(undefined, arguments);
  };
};
