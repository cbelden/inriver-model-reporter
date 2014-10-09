var app = require('./app');
var R = require('ramda');
var remote = require('remote');
var dialog = remote.require('dialog');

/**
 * This directive represents a file input control. Create it with the
 * <file-input> tag.
 *
 * label:          The label to display above the input control.
 * filename:       A bound variable storing the currently selected filename
 *                  or an array of filenames if multi-select is enabled.
 * dialogOptions:  The options object which will be passed to atom-shell's
 *                  'dialog.showOpenDialog' method. Check the docs for deets.
 **/
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
