/* ==== Includes ==== */
var app = require('app');
var browserWindow = require('browser-window');
var globalShortcut = require('global-shortcut');
var dialog = require('dialog');

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new browserWindow({
    width: 800,
    height: 600,
    title: "PIM Model Reporter"
  });

  mainWindow.loadUrl('file://' + __dirname + '/ui/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  globalShortcut.register('ctrl+alt+i',
    mainWindow.toggleDevTools.bind(mainWindow)
  );

  mainWindow.on('openPreviousModelDialog', function (event) {
    dialog.showOpenDialog(mainWindow,
      {
          'title': "Select Previous Model File"
      },
      function (filePaths) {
        //TODO
        event.sender.send('selectedPreviousModel', R.head(filePaths));
      });
  });

  mainWindow.on('openCurrentModelDialog', function (event) {
    dialog.showOpenDialog(mainWindow,
    {
        'title': "Select Current Model File"
    },
    function (filePaths) {
      //TODO
      event.sender.send('selectedCurrentModel', R.head(filePaths));
    });
  });

});

// var Q = require('q');
// var R = require('ramda');
// var utils = require('./utilities');
// var entity = require('./dataModels/entity');
// var diffTools = require('./diffTools/diffUtils');
//
//
// /* ==== Configuration ==== */
// var OLD_MODEL_FILE = "../data/old-pim-model.xml";
// var NEW_MODEL_FILE = "../data/new-pim-model.xml";
//
//
// /* ==== Execution ==== */
// var loadEntityVersions = function (previousFileName, currentFileName) {
//   return Q.all([
//     utils.parseXMLFile(previousFileName).then(entity.parseModels),
//     utils.parseXMLFile(currentFileName).then(entity.parseModels)
//   ]);
// }
//
// loadEntityVersions(OLD_MODEL_FILE, NEW_MODEL_FILE)
//   .spread(diffTools.diffObjects)
//   .then(diffTools.pruneDiff)
//   .then(utils.tapInspect)
//   .done();
