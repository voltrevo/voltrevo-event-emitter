'use strict';

module.exports = function(fn) {
  var jobs = [fn];

  while (jobs.length > 0) {
    jobs.shift()(function(job) {
      jobs.push(job);
    });
  }
};
