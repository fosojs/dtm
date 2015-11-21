'use strict';

function writeScript(id, url, opts) {
  if (arguments.length < 3 || arguments.length === 2 &&
    typeof arguments[2] === 'object') {
    writeScript(null, id, url);
  }
  opts = opts || {};

  var script = document.createElement('script');
  script.id = id;
  script.src = url;
  script.async = opts.async;
  /* jshint ignore:start */
  document.write(script.outerHTML);
  /* jshint ignore:end */
}

module.exports = writeScript;
