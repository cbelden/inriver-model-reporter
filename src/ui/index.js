var $ = require('../lib/jquery/jquery');
var ipc = require('ipc');

/* We need to do this b/c the atom-shell framework doesn't load jQuery as a
 * global and semantic.js needs that.
 */
window.jQuery = window.$ = $;
require('../lib/semantic-ui/javascript/semantic.js');

$.ready(function () {
  $('[data-id="previousModelButton"]').click(function () {
    ipc.send('openPreviousModelDialog');
  });

  $('[data-id="currentModelButton"]').click(function () {
    ipc.send('openCurrentModelDialog');
  });
})

ipc.on('selectedPreviousModel', function (filePath) {
  $('[data-id="currentModelText"]').val(filePath);
});

ipc.on('selectedCurrentModel', function (filePath) {
  $('[data-id="previousModelText"]').val(filePath);
});
