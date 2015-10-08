'use strict';

var getSource = require('./getSource');
var invariant = require('invariant');
var vm = require('vm');

function compile(model) {
  invariant(!model.hasOwnProperty('model'), 'You should pass model.model');

  var sandbox = {};
  vm.runInNewContext(getSource(model), sandbox);

  return sandbox.classify;
}

module.exports = compile;
