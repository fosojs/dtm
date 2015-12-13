'use strict';

var expect = require('chai').expect;
var Bundler = require('../lib/bundler');

var cdn = window.cdn = {
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
    bundler.load();
    var el = document.getElementById('test-1');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/bundle/foo@1.3.1(lib/bar+foo),charlie@10.3.1.js');
    el.parentNode.removeChild(el);
  });

  it('should compose a package when on file is pased not in array', function() {
    var bundler = new Bundler('js', {
      id: 'test-one-file'
    });
    bundler.addPackage({
      name: 'foo',
      version: '1.3.1',
      files: 'lib/bar'
    });
    bundler.load();
    var el = document.getElementById('test-one-file');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/bundle/foo@1.3.1(lib/bar).js');
    el.parentNode.removeChild(el);
  });

  it('shoud add the version from the cdn object if not passed', function() {
    cdn.packages.foo = {
      version: '43.2.1'
    };
    var bundler = new Bundler('js', {
      id: 'test-2'
    });
    bundler.addPackage({
      name: 'foo',
      files: ['qar']
    });
    bundler.load();
    var el = document.getElementById('test-2');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/bundle/foo@43.2.1(qar).js');
    el.parentNode.removeChild(el);
  });

  it('should add several files when they are added with separate calls to the bundler API', function() {
    var bundler = new Bundler('js', {
      id: 'test-1'
    });
    bundler.addPackage({
      name: 'foo',
      version: '1.3.1',
      files: [
        'lib/bar'
      ]
    });
    bundler.addPackage({
      name: 'foo',
      files: [
        'foo'
      ]
    });
    bundler.addPackage({
      name: 'charlie',
      version: '10.3.1'
    });
    bundler.load();
    var el = document.getElementById('test-1');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/bundle/foo@1.3.1(lib/bar+foo),charlie@10.3.1.js');
    el.parentNode.removeChild(el);
  });

  it('shouldn\'t add script w/o files', function() {
    var bundler = new Bundler('js', {
      id: 'not-exists'
    });
    bundler.load();
    var el = document.getElementById('not-exists');
    expect(el).to.not.exist;
  });

  it('should add each file only once', function() {
    var bundler = new Bundler('js', {
      id: 'each-file-once'
    });
    bundler.addPackage({
      name: 'bingo',
      version: '1.0.0',
      files: ['foo', 'bar', 'FOO']
    });
    bundler.load();
    var el = document.getElementById('each-file-once');
    expect(el.tagName).to.eq('SCRIPT');
    expect(el.src).to.eq('http://cdn.kochan.io/bundle/bingo@1.0.0(foo+bar).js');
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
    bundler.load();
    var el = document.getElementById('test-1');
    expect(el.tagName).to.eq('LINK');
    expect(el.href).to.eq('http://cdn.kochan.io/bundle/foo@1.3.1(lib/bar+foo),charlie@10.3.1.css');
    el.parentNode.removeChild(el);
  });
});
