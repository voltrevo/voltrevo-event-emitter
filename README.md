# voltrevo-event-emitter
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status](https://coveralls.io/repos/voltrevo/voltrevo-event-emitter/badge.svg?branch=master&service=github)](https://coveralls.io/github/voltrevo/voltrevo-event-emitter?branch=master) [![Code Climate](https://codeclimate.com/github/voltrevo/voltrevo-event-emitter/badges/gpa.svg)](https://codeclimate.com/github/voltrevo/voltrevo-event-emitter)
> My utopian vision for how eventing can be done differently.

An event emitter that probably does everything you actually need in only 86 lines of code.

## Install

```sh
$ npm install --save voltrevo-event-emitter
```


## Usage

```js
'use strict';

var EventEmitter = require('voltrevo-event-emitter');

var ee = EventEmitter();

// events are asynchronous

ee.emit('foo', 'bar');

ee.on('foo', function(value) {
  console.log(value); // bar
});

// .once works as usual

ee.emit('boom');
ee.emit('boom');

ee.once('boom', function() {
  console.log('boom'); // only one boom
});

// .on and .once return Collection elements, which have .value (your handler)
// and .remove

ee.emit('unicorn');

var listener = ee.on('unicorn', function() {
  console.log('A wild unicorn appeared!'); // this never happens
});

listener.remove();
```

## License

MIT © [Andrew Morris](http://andrewmorris.io/)


[npm-image]: https://badge.fury.io/js/voltrevo-event-emitter.svg
[npm-url]: https://npmjs.org/package/voltrevo-event-emitter
[travis-image]: https://travis-ci.org/voltrevo/voltrevo-event-emitter.svg?branch=master
[travis-url]: https://travis-ci.org/voltrevo/voltrevo-event-emitter
[daviddm-image]: https://david-dm.org/voltrevo/voltrevo-event-emitter.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/voltrevo/voltrevo-event-emitter
