'use strict';

var codegen = require('./codegen');
var recast = require('recast');

function getSource(node) {
  return recast.print(codegen(node), {tabWidth: 2}).code;
}

module.exports = getSource;
