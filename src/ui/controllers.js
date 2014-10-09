var app = require('./app');
var ipc = require('ipc');
var util = require('util');

app.controller('modelReporterCtrl', function ($scope) {
  /* ==== Model Variables ==== */
  $scope.previousModelFilename = "";
  $scope.currentModelFilename = "";
  $scope.diffResults = "";
  $scope.fileDialogOptions = {
    'title': "Select Model File",
    'filters': [
      {
        'name': 'Model Files',
        'extensions': ['xml']
      }
    ],
    'properties': [
      'openFile'
    ]
  };

  /* ==== View Handlers ==== */
  $scope.performDiff = function () {
    ipc.send('performDiff',{
      'previousModelFilename': $scope.previousModelFilename,
      'currentModelFilename': $scope.currentModelFilename
    });
  }

  $scope.$watch('previousModelFilename', function () {
    console.log("previousModelFilename: " + $scope.previousModelFilename);
  });

  $scope.$watch('currentModelFilename', function () {
    console.log("currentModelFilename: " + $scope.currentModelFilename);
  });

  /* ==== ipc Handlers ==== */

  ipc.on('returnDiffResults', function (results) {
    $scope.diffResults = util.inspect(results, { depth: 100 });
    $scope.$apply();
  });
});
