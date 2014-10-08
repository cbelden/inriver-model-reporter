var ipc = require('ipc');
var util = require('util');

var modelReporterApp = angular.module('modelReporterApp', []);

modelReporterApp.controller('modelReporterCtrl', function ($scope) {
  /* ==== Model Variables ==== */
  $scope.previousModelFilename = "";
  $scope.currentModelFilename = "";
  $scope.diffResults = "";

  /* ==== View Handlers ==== */
  $scope.choosePreviousModel = function () {
    ipc.send('openPreviousModelDialog');
  }

  $scope.chooseCurrentModel = function () {
    ipc.send('openCurrentModelDialog');
  }

  $scope.performDiff = function () {
    ipc.send('performDiff');
  }

  /* ==== ipc Handlers ==== */

  ipc.on('selectedPreviousModel', function (filename) {
    $scope.previousModelFilename = filename;
    $scope.$apply();
  });

  ipc.on('selectedCurrentModel', function (filename) {
    $scope.currentModelFilename = filename;
    $scope.$apply();
  });

  ipc.on('returnDiffResults', function (results) {
    $scope.diffResults = util.inspect(results, { depth: 100 });
    $scope.$apply();
  });
});
