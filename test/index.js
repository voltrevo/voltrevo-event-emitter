'use strict';

/* global describe it */

var assert = require('assert');

var EventEmitter = require('../lib');

var asyncBox = require('./util/asyncBox.js');
var CountingMap = require('./util/CountingMap.js');
var Sequence = require('./util/Sequence.js');

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
    var sequence = Sequence();

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');

      ee.on('foo', sequence.adder('a'));

      var cListener = ee.on('foo', sequence.adder('c'));

      ee.on('foo', sequence.adder('b'));

      cListener.remove();
      ee.on('foo', sequence.adder('c'));
    });

    assert.deepEqual(sequence.elements, ['a', 'b', 'c']);
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

  it('adding a listener from a listener should not change listener order', function() {
    var sequence = Sequence();

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.emit('foo');

      ee.on('foo', sequence.adder('a'));

      ee.once('foo', function() {
        ee.on('foo', sequence.adder('x'));
        ee.emit('foo');
      });

      ee.on('foo', sequence.adder('b'));
    });

    assert.deepEqual(sequence.elements, ['a', 'b', 'a', 'b', 'x']);
  });

  it('allows adding the same listener multiple times', function() {
    // This test is a port of:
    // https://github.com/Olical/EventEmitter/blob/8553de790c/tests/tests.js#L135-L148
    //
    // With an important difference: it checks the opposite behaviour! A key motivation behind
    // .on/.once returning a listener handle with .remove instead of having a .off/.removeListener
    // method is so that you can differentiate between separate bindings of the same listener. This
    // makes the behaviour below possible in a non-confusing way.
    //
    // Without getting a .remove from the listener binding, the EventEmitter implementation has no
    // choice but either ignore extra bindings of one listener, or fail to preserve the ordering you
    // expect when you remove a listener, since that listener may already be on the event, and the
    // EventEmitter cannot tell which one you intended to remove.
    //
    // It is very reasonable to expect that adding a listener multiple times will result in multiple
    // calls to that listener on the same emit. It may be rare that you actually want to do that but
    // I believe that violating this expectation is a flaw in all popular EventEmitter
    // implementations.

    var count = 0;

    var adder = function() {
      count += 1;
    };

    asyncBox(function(async) {
      var ee = EventEmitter(async);

      ee.on('foo', adder);
      ee.on('foo', adder);
      ee.on('foo', adder);
      ee.emit('foo');
    });

    assert.strictEqual(count, 3);
  });
});
