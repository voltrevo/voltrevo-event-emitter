'use strict';

/* global describe it */

var EventEmitter = require('../lib');

describe('EventEmitter', function() {
  it('should emit an event', function(done) {
    var ee = EventEmitter();

    ee.emit('foo');
    ee.once('foo', done);
  });
});
