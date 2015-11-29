'use strict';

var writeScript = require('./write-script');
var cookie = require('easy-cookie');
var skippedPackagesKey = 'ung.skipped';
var separator = ',';
window.ung.skippedPackages = (cookie.get(skippedPackagesKey) || '')
  .split(separator);

if (window.ung.skippedPackages.length > 0) {
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
