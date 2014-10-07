var $ = require('../lib/jquery/jquery');
var ipc = require('ipc');
var util = require('util');

/* We need to do this b/c the atom-shell framework doesn't load jQuery as a
 * global and semantic.js needs that.
 */
window.jQuery = window.$ = $;
require('../lib/semantic-ui/javascript/semantic.js');

$(document).ready(function () {
  $('[data-id="btnPreviousModel"]').click(function () {
    ipc.send('openPreviousModelDialog');
  });

  $('[data-id="btnCurrentModel"]').click(function () {
    ipc.send('openCurrentModelDialog');
  });

  $('[data-id="btnPerformDiff"]').click(function () {
    ipc.send('performDiff');
  });
})

ipc.on('selectedPreviousModel', function (filePath) {
  $('[data-id="txtPreviousModel"]').val(filePath);
});

ipc.on('selectedCurrentModel', function (filePath) {
  $('[data-id="txtCurrentModel"]').val(filePath);
});

ipc.on('returnDiffResults', function (results) {
  var displayResults = util.inspect(results, {
    depth: 100
  });
  $('[data-id="pnlDiffResults"]').text(displayResults);
});
