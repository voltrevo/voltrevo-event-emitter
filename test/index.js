'use strict';

/* global describe it */

var assert = require('assert');

var asyncBox = require('./asyncBox.js');
var CountingMap = require('./CountingMap.js');
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
    var cm = CountingMap();

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      var listeners = ['a', 'b', 'c'].map(function(letter) {
        return ee.on('foo', cm.handler(letter));
      });

      ee.emit('foo');

      listeners[1].remove();

      ee.on('foo', cm.handler('d'));

      ee.emit('foo');
    });

    assert.deepEqual(cm.counts, {
      a: 2,
      b: 0,
      c: 2,
      d: 2
    });
  });

  it('extra calls to remove do nothing', function() {
    var cm = CountingMap();

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      var listeners = ['a', 'b', 'c'].map(function(letter) {
        return ee.on('foo', cm.handler(letter));
      });

      ee.emit('foo');

      listeners[1].remove();
      listeners[1].remove();

      ee.on('foo', cm.handler('d'));

      listeners[1].remove();

      ee.emit('foo');
    });

    assert.deepEqual(cm.counts, {
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
    var cm = CountingMap();

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');

      ee.on('foo', cm.handler('a')).remove();
      ee.on('foo', cm.handler('b')).remove();
    });

    assert.deepEqual(cm.counts, {
      a: 0,
      b: 0
    });
  });
});
