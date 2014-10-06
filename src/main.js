/* ==== Includes ==== */
var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadUrl('file://' + __dirname + '/ui/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
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
