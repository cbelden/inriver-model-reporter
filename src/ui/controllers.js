var app = require('./app');
var ipc = require('ipc');
var util = require('util');

app.controller('modelReporterCtrl', function ($scope) {
  /* ==== Model Variables ==== */
  $scope.previousModelFilename = "";
  $scope.currentModelFilename = "";
  $scope.versionedEntities = [];
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

  /* ==== ipc Handlers ==== */
  ipc.on('returnDiffResults', function (results) {
    $scope.versionedEntities = results;
    $scope.diffResults = util.inspect(results, { depth: 100 });
    $scope.$apply();
  });
});
