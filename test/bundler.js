'use strict';

var expect = require('chai').expect;
var Bundler = require('../lib/bundler');

var ung = window.ung = {
  packages: {},
  origin: 'cdn.kochan.io'
};

describe('Bundler for js', function() {
  it('should compose a package link', function() {
    var bundler = new Bundler('js', {
      id: 'test-1'
    });
    bundler.addPackage({
      name: 'foo',
      version: '1.3.1',
      files: [
        'lib/bar',
        'foo'
      ]
    });
    bundler.addPackage({
      name: 'charlie',
      version: '10.3.1'
    });
    bundler.write();
    var el = document.getElementById('test-1');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/packages/foo@1.3.1!lib/bar;foo,charlie@10.3.1.js');
    el.parentNode.removeChild(el);
  });

  it('shoud add the version from the ung object if not passed', function() {
    ung.packages.foo = {
      version: '43.2.1'
    };
    var bundler = new Bundler('js', {
      id: 'test-2'
    });
    bundler.addPackage({
      name: 'foo',
      files: ['qar']
    });
    bundler.write();
    var el = document.getElementById('test-2');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/packages/foo@43.2.1!qar.js');
    el.parentNode.removeChild(el);
  });
});

describe('Bundler for css', function() {
  it('should compose a package link', function() {
    var bundler = new Bundler('css', {
      id: 'test-1'
    });
    bundler.addPackage({
      name: 'foo',
      version: '1.3.1',
      files: [
        'lib/bar',
        'foo'
      ]
    });
    bundler.addPackage({
      name: 'charlie',
      version: '10.3.1'
    });
    bundler.write();
    var el = document.getElementById('test-1');
    expect(el.tagName).to.eq('LINK');
    expect(el.href).to.eq('http://cdn.kochan.io/packages/foo@1.3.1!lib/bar;foo,charlie@10.3.1.css');
    el.parentNode.removeChild(el);
  });
});
