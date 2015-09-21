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

  it('should not call a once listener more than once', function() {
    var calls = 0;

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');
      ee.emit('foo');

      ee.once('foo', function() {
        calls++;
      });

      ee.emit('foo');
      ee.emit('foo');
    });

    assert.equal(calls, 1);
  });

  it('should call an on listener more than once', function() {
    var calls = 0;

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');
      ee.emit('foo');

      ee.on('foo', function() {
        calls++;
      });

      ee.emit('foo');
      ee.emit('foo');
    });

    assert.equal(calls, 4);
  });

  it('should handle adding handlers after removals', function() {
    var counts = {};

    var countingHandler = function(name) {
      counts[name] = counts[name] || 0;

      return function() {
        counts[name]++;
      };
    };

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      var listeners = ['a', 'b', 'c'].map(function(letter) {
        return ee.on('foo', countingHandler(letter));
      });

      ee.emit('foo');

      listeners[1].remove();

      ee.on('foo', countingHandler('d'));

      ee.emit('foo');
    });

    assert.deepEqual(counts, {
      a: 2,
      b: 0,
      c: 2,
      d: 2
    });
  });

  it('extra calls to remove do nothing', function() {
    var counts = {};

    var countingHandler = function(name) {
      counts[name] = counts[name] || 0;

      return function() {
        counts[name]++;
      };
    };

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      var listeners = ['a', 'b', 'c'].map(function(letter) {
        return ee.on('foo', countingHandler(letter));
      });

      ee.emit('foo');

      listeners[1].remove();
      listeners[1].remove();

      ee.on('foo', countingHandler('d'));

      listeners[1].remove();

      ee.emit('foo');
    });

    assert.deepEqual(counts, {
      a: 2,
      b: 0,
      c: 2,
      d: 2
    });
  });

  it('should call handlers in the order they were added', function() {
    var sequence = [];

    var makeHandler = function(tag) {
      return function() {
        sequence.push(tag);
      };
    };

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');

      ee.on('foo', makeHandler('a'));

      var cListener = ee.on('foo', makeHandler('c'));

      ee.on('foo', makeHandler('b'));

      cListener.remove();
      ee.on('foo', makeHandler('c'));
    });

    assert.deepEqual(sequence, ['a', 'b', 'c']);
  });

  it('should remove multiple handlers', function() {
    var counts = {};

    var countingHandler = function(name) {
      counts[name] = counts[name] || 0;

      return function() {
        counts[name]++;
      };
    };

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');

      ee.on('foo', countingHandler('a')).remove();
      ee.on('foo', countingHandler('b')).remove();
    });

    assert.deepEqual(counts, {
      a: 0,
      b: 0
    });
  });
});
