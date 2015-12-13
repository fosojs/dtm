'use strict';

var writeScript = require('./write-script');
var console = require('console-ponyfill');

function Bundler(type, opts) {
  this._id = opts.id;
  this._type = type;
  this._packages = {};
}

Bundler.prototype.addPackage = function(opts) {
  if (!opts) {
    throw new Error('opts is required');
  }
  if (!opts.name) {
    throw new Error('opts.name is required');
  }
  if (!opts.version && typeof cdn !== 'undefined' &&
    cdn.packages && cdn.packages[opts.name]) {
    opts.version = cdn.packages[opts.name].version;
  }
  if (!this._packages[opts.name]) {
    this._packages[opts.name] = opts;
    return;
  }

  if (opts.version && this._packages[opts.name].version !== opts.version) {
    console.warn('Files from different versions of the', opts.name,
      'package are required');
  }
  this._packages[opts.name].files = this._packages[opts.name].files || [];
  this._packages[opts.name].files = this._packages[opts.name].files
    .concat(opts.files || []);
};

Bundler.prototype._createURL = function() {
  var url = '//' + window.cdn.origin + '/bundle/';
  var packageAddresses = [];
  Object.keys(this._packages).forEach(function(pkgName) {
    var pkg = this._packages[pkgName];
    if (typeof pkg === 'string') {
      packageAddresses.push('@' + pkg);
      return;
    }
    var pkgAddr = pkg.name + '@' + pkg.version;
    if (pkg.files && pkg.files.length) {
      pkgAddr += '(' + pkg.files.join('+') + ')';
    }
    packageAddresses.push(pkgAddr);
  }, this);
  return url + packageAddresses.join(',') + '.' + this._type;
};

function loadStyles(id, url) {
  var css = document.createElement('link');
  css.id = id;
  css.href = url;
  css.rel = 'stylesheet';
  css.type = 'text/css';
  /* jshint ignore:start */
  document.write(css.outerHTML);
  /* jshint ignore:end */
}

Bundler.prototype.write = function() {
  if (!Object.keys(this._packages).length) {
    return;
  }
  var url = this._createURL();
  if (this._type === 'js') {
    writeScript(this._id, url);
    return;
  }
  if (this._type === 'css') {
    loadStyles(this._id, url);
  }
};

module.exports = Bundler;
