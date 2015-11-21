'use strict';

var expect = require('chai').expect;
var PackagesLoader = require('../lib/packages-loader');

var ung = window.ung = {
  packages: {},
  origin: 'cdn.kochan.io'
};

describe('PackagesLoader', function() {
  it('should compose a package link', function() {
    var packageLoader = new PackagesLoader('js', {
      id: 'test-1'
    });
    packageLoader.addPackage({
      name: 'foo',
      version: '1.3.1',
      files: [
        'lib/bar',
        'foo'
      ]
    });
    packageLoader.addPackage({
      name: 'charlie',
      version: '10.3.1'
    });
    packageLoader.write();
    var el = document.getElementById('test-1');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/packages/foo@1.3.1!lib/bar;foo,charlie@10.3.1.js');
    el.parentNode.removeChild(el);
  });

  it('shoud add the version from the ung object if not passed', function() {
    ung.packages.foo = {
      version: '43.2.1'
    };
    var packageLoader = new PackagesLoader('js', {
      id: 'test-2'
    });
    packageLoader.addPackage({
      name: 'foo',
      files: ['qar']
    });
    packageLoader.write();
    var el = document.getElementById('test-2');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/packages/foo@43.2.1!qar.js');
    el.parentNode.removeChild(el);
  });
});
