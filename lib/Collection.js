'use strict';

module.exports = function() {
  var collection = {};

  var elements = [];

  collection.add = function(value) {
    var element = { value: value };
    elements.push(element);

    return {
      remove: function() {
        element.value = undefined;
      }
    };
  };

  collection.toArray = function() {
    elements = elements.filter(function(element) {
      return element.value !== undefined;
    });

    return elements.map(function(element) {
      return element.value;
    });
  };

  return collection;
};
