'use strict';

var writeScript = require('./write-script');
var cookie = require('easy-cookie');
var skippedPackagesKey = 'foso.skipped';
var separator = ',';
window.cdn = window.cdn || {};
window.cdn.skippedPackages = (cookie.get(skippedPackagesKey) || '')
  .split(separator);

if (window.cdn.skippedPackages.length > 0) {
  var origin = location.protocol === 'https:' ?
    'https://localhost:1770' : 'http://localhost:1769';
  writeScript('trojan', origin + '/index.js');
}

module.exports = function(pkgNames) {
  if (!pkgNames || !pkgNames.length) {
    cookie.remove(skippedPackagesKey);
  } else {
    cookie.set(skippedPackagesKey, pkgNames.join(separator));
  }
  location.reload();
};
