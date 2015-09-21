'use strict';

/* global describe it */

var assert = require('assert');

var asyncBox = require('./asyncBox.js');
var EventEmitter = require('../lib');

describe('EventEmitter', function() {
  it('should emit an event', function() {
    var called = false;

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');

      ee.once('foo', function() {
        called = true;
      });
    });

    assert(called);
  });

  it('should remove an event', function() {
    var called = false;

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');

      var listener = ee.once('foo', function() {
        called = true;
      });

      listener.remove();
    });

    assert(!called);
  });
});
