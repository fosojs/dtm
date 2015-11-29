'use strict';

var scriptTag = document.getElementsByTagName('script')[0];

function writeScript(id, url, opts) {
  opts = opts || {};

  var script = document.createElement('script');
  script.id = id;
  script.src = url;
  script.async = opts.async;
  scriptTag.parentNode.insertBefore(script, scriptTag);
}

module.exports = writeScript;
