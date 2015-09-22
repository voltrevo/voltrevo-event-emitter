'use strict';

var Collection = require('./Collection.js');
var MapWithDefault = require('./MapWithDefault.js');

module.exports = function(asyncParam) {
  var async = asyncParam || global.setTimeout;

  var eventEmitter = {};

  var events = MapWithDefault(Collection);

  eventEmitter.on = function(evt, handler) {
    return events.get(evt).add(handler);
  };

  eventEmitter.once = function(evt, handler) {
    var listener = events.get(evt).add(function(value) {
      listener.remove();
      handler(value);
    });

    return listener;
  };

  eventEmitter.emit = function(evt, value) {
    async(function() {
      events.get(evt).toArray().forEach(function(handler) {
        handler(value);
      });
    });
  };

  return eventEmitter;
};
