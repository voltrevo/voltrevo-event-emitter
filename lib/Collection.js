'use strict';

var once = require('./once.js');

module.exports = function() {
  var collection = {};

  var elements = [];
  var holes = [];

  var nextIndex = function() {
    if (holes.length > 0) {
      return holes.shift();
    }

    return elements.length;
  };

  collection.add = function(value) {
    var handle = {};
    var index = nextIndex();

    elements.push(handle);

    handle.value = value;

    handle.remove = once(function() {
      elements[index] = undefined;
      holes.push(index);
    });

    return handle;
  };

  collection.each = function(fn) {
    elements.forEach(function(el) {
      if (el) {
        fn(el.value);
      }
    });
  };

  return collection;
};
