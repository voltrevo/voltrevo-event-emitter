'use strict';

module.exports = function() {
  var countingMap = {};

  countingMap.counts = {};

  countingMap.handler = function(name) {
    countingMap.counts[name] = countingMap.counts[name] || 0;

    return function() {
      countingMap.counts[name]++;
    };
  };

  return countingMap;
};
