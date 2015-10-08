var fs = require('fs');
var csv = require('csv');
var C45c = require('../index');

var codegen = require('../codegen');
var recast = require('recast');

function isNumeric(n) {
  return !isNaN(n);
}

function testCSV(filename, callback) {
  function fileLoaded(err, data) {
    if (err) {
      console.error(err);
    } else {
      csv.parse(data, parseCSV);
    }
  }

  function parseCSV(err, data) {
    var headers = data[0];
    var features = headers.slice(1,-1);
    var target = headers[headers.length-1];

    var trainingData = data.slice(1).map(function(d) {
      return d.slice(1);
    });

    var featureTypes = trainingData[0].map(function(d) {
      return isNumeric(d) ? 'number' : 'category';
    });

    train(trainingData, target, features, featureTypes);
  }

  function train(trainingData, target, features, featureTypes) {
    C45c.train({
        data: trainingData,
        target: target,
        features: features,
        featureTypes: featureTypes
      }, function(error, classify) {
      if (error) {
        console.error(error.stack);
      } else {
        console.log(classify.toString());
        callback(function(testData, targets) {
          targets.forEach(function(target, i) {
            var featureObj = {};
            testData[i].forEach(function(value, j) {
              featureObj[features[j]] = value;
            });
            console.log(classify(featureObj), target);
          });
        }, classify);
      }
    });
  }

  fs.readFile(filename, fileLoaded);
}

testCSV(__dirname + '/tennis.csv', function(classifyTest) {
  var testData = [
    ['Overcast', 'Mild', 'High', 'Strong'],
    ['Rain', 'Mild', 'High', 'Strong'],
    ['Sunny', 'Cool', 'Normal', 'Weak'],
  ];
  var targets = ['Yes','No','Yes'];

  classifyTest(testData, targets);
});
