'use strict';

var c45 = require('c4.5');
var compile = require('./compile');

function train(options, cb) {
  c45.train(options, function(err, model) {
    if (err) {
      cb(err);
      return;
    }
    try {
      cb(null, compile(model.model));
    } catch (e) {
      cb(e);
    }
  });
}

module.exports = train;
