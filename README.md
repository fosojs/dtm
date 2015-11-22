# ung-dtm

Dynamic tag manager for pages that are loading resource from [ung server][].


## Usage example

With ung dtm it is possible to load all the required resources of a page with
one request.

Lets suppose a page needs to load the `foo`, `bar` packages. However,
it also needs to load the `baz` package if the user is from a mobile device.

With ung dtm, it is possible to create a Bundler object at the head of the page,
add packages to it throughout the page and all the packages will be loaded by one
request at the bottom of the page:

```js
/* somewhere in the head section of the page */
window.bottomBundler = new Bundler('js', {
  id: 'bottom'
});

/* ... */
bottomBundler.addPackage({
  name: 'foo'
});

/* ... */

bottomBundler.addPackage({
  name: 'bar',
  version: '43.2.1',
  files: [
    'lib/file1',
    'lib/file2'
  ]
});

/* ... */

if (isMobile) {
  bottomBundler.addPackage({
    name: 'baz'
  });
}

/* somewhere at the bottom of the page */
bottomBundler.write();
```


## License

The MIT License (MIT)


[ung server]: https://github.com/ungjs/ung-server
