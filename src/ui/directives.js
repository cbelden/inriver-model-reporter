var app = require('./app');
var R = require('ramda');
var remote = require('remote');
var dialog = remote.require('dialog');

app.directive('fileInput', function () {
  return {
    'restrict': "E",
    'templateUrl': "./partials/fileInput.html",
    'scope': {
      'label': "@",
      'filename': "=",
      'dialogOptions': "="
    },
    'controller': function ($scope) {
      $scope.displayFilename = "";

      /**
       * Indicates whether the dialog allows multiple files to be selected
       **/
      $scope.isMultiSelect = function () {
        var props = R.get('properties', $scope.dialogOptions);
        return (props !== undefined) && R.contains('multiSelections', props);
      }

      /**
       * Prompts the user to select a file and saves the resultant path(s)
       **/
      $scope.chooseFile = function () {
        var filePaths = dialog.showOpenDialog(
            remote.getCurrentWindow(),
            $scope.dialogOptions
        );
        if ($scope.isMultiSelect()) {
          $scope.filename = R.clone(filePaths);
          $scope.displayFilename = $scope.filename.join(";");
        } else {
          $scope.filename = R.head(filePaths);
          $scope.displayFilename = $scope.filename;
        }
      }

    }
  }
})
