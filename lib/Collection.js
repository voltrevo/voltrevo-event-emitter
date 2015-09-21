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

  collection.each = function(fn) {
    var currElements = elements;
    elements = [];

    currElements.forEach(function(el) {
      if (el.value) {
        elements.push(el);
        fn(el.value);
      }
    });
  };

  return collection;
};
