'use strict';

var once = require('./once.js');

module.exports = function() {
  var collection = {};

  var elements = [];

  collection.add = function(value) {
    var element = { value: value };
    elements.push(element);

    return {
      remove: once(function() {
        element.value = undefined;
      })
    };
  };

  collection.toArray = function(fn) {
    elements = elements.filter(function(element) {
      return element.value !== undefined;
    });

    return elements.map(function(element) {
      return element.value;
    });
  };

  return collection;
};
