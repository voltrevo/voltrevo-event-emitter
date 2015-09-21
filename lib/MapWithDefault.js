'use strict';

module.exports = function(defaultGenerator) {
  var map = {};

  var underlyingMap = {};

  map.get = function(key) {
    var value = underlyingMap[key];

    if (value === undefined) {
      value = defaultGenerator();
      map.set(key, value);
    }

    return value;
  };

  map.set = function(key, value) {
    underlyingMap[key] = value;
  };

  return map;
};
