var $ = require('../lib/jquery/jquery');

/* We need to do this b/c the atom-shell framework doesn't load jQuery as a
 * global and semantic.js needs that.
 */
window.jQuery = window.$ = $;
require('../lib/semantic-ui/javascript/semantic.js');

$(document).ready(function () {
  $('.ui.accordion').accordion();
})
