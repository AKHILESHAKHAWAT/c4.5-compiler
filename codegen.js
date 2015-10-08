'use strict';

var recast = require("recast");
var types = recast.types;
var n = types.namedTypes;
var b = types.builders;

var FEATURES_NAME = 'features';

function getFeatureAst(featureName) {
  return b.memberExpression(
    b.identifier(FEATURES_NAME),
    b.literal(featureName),
    true
  );
}

function _codegen(node) {
  if (node.type === 'result') {
    return b.returnStatement(b.literal(node.value));
  } else if (node.type === 'feature_number') {
    var test = b.binaryExpression(
      '>',
      getFeatureAst(node.name),
      b.literal(node.cut)
    );
    return b.ifStatement(
      test,
      _codegen(node.values[0].child),
      _codegen(node.values[1].child)
    );
  } else {
    // category
    return b.switchStatement(
      getFeatureAst(node.name),
      node.values.map(function(node) {
        var body = [_codegen(node.child)];
        if (node.child.type !== 'result') {
          body.push(b.breakStatement());
        }
        return b.switchCase(
          b.literal(node.name),
          body
        );
      }) // TODO: concat a default case for error handling?
    );
  }
}

function codegen(node) {
  return b.functionExpression(
    b.identifier('classify'),
    [b.identifier('features')],
    b.blockStatement([_codegen(node)])
  );
}

module.exports = codegen;
