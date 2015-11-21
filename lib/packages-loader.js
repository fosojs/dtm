'use strict';

function PackagesLoader(type, opts) {
  this._id = opts.id;
  this._type = type;
  this._packages = [];
}

PackagesLoader.prototype.addPackage = function(opts) {
  if (!opts) {
    throw new Error('opts is required');
  }
  if (!opts.name) {
    throw new Error('opts.name is required');
  }
  if (!opts.version && window.ung && ung.packages && ung.packages[opts.name]) {
    opts.version = ung.packages[opts.name].version;
  }
  this._packages.push(opts);
};

PackagesLoader.prototype._createURL = function() {
  var url = '//' + window.ung.origin + '/packages/';
  var packageAddresses = [];
  this._packages.forEach(function(pkg) {
    var pkgAddr = pkg.name + '@' + pkg.version;
    if (pkg.files && pkg.files.length) {
      pkgAddr += '!' + pkg.files.join(';');
    }
    packageAddresses.push(pkgAddr);
  });
  return url + packageAddresses.join(',') + '.' + this._type;
};

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

PackagesLoader.prototype.write = function() {
  var url = this._createURL();
  if (this._type === 'js') {
    writeScript(this._id, url);
    return;
  }
};

module.exports = PackagesLoader;
