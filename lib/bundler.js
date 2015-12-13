'use strict';

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
  if (typeof opts.files === 'string') {
    opts.files = [opts.files];
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

function loadCSSNode(id, url, opts) {
  var css = document.createElement('link');
  css.id = id;
  css.href = url;
  css.rel = 'stylesheet';
  css.type = 'text/css';
  if (opts.sequential) {
    document.write(css.outerHTML);
    return;
  }
  var linkTags = document.getElementsByTagName('link');
  var lastLinkTag = linkTags[linkTags.length - 1];
  if (lastLinkTag) {
    lastLinkTag.parentNode.insertBefore(css, lastLinkTag.nextSibling);
    return;
  }
  document.querySelector('head').appendChild(css);
}

function loadJSNode(id, url, opts) {
  opts = opts || {};
  var script = document.createElement('script');
  script.id = id;
  script.src = url;
  script.async = opts.async;
  if (opts.sequential) {
    document.write(script.outerHTML);
    return;
  }
  var jsTags = document.getElementsByTagName('script');
  var jsTag = jsTags[jsTags.length - 1];
  jsTag.parentNode.insertBefore(script, jsTag.nextSibling);
}

Bundler.prototype.load = function(opts) {
  if (typeof opts === 'boolean') {
    opts = {
      sequential: opts
    };
  }
  opts = opts || {};
  if (!Object.keys(this._packages).length) {
    return;
  }
  var url = this._createURL();
  if (this._type === 'js') {
    loadJSNode(this._id, url, opts);
    return;
  }
  if (this._type === 'css') {
    loadCSSNode(this._id, url, opts);
  }
};

module.exports = Bundler;
