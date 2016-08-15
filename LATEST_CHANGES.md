<a name="7.0.0"></a>
# 7.0.0 (2016-08-15)


### Bug Fixes

* **build:** add missing transform ([856e3de](https://github.com/pivotal-cf/pivotal-ui/commit/856e3de))
* **styleguide:** adjust import for babel 6 ([d201412](https://github.com/pivotal-cf/pivotal-ui/commit/d201412))
* **styleguide:** Include regenerator runtime transform ([38a62f7](https://github.com/pivotal-cf/pivotal-ui/commit/38a62f7))
* **styleguide:** Make sure there are no empty docs ([7235581](https://github.com/pivotal-cf/pivotal-ui/commit/7235581))
* **styleguide:** Remove categories from docs that live in a subtree ([6f9eb38](https://github.com/pivotal-cf/pivotal-ui/commit/6f9eb38))

### Features

* **forms:** data-validate-event ([9ecdb98](https://github.com/pivotal-cf/pivotal-ui/commit/9ecdb98))


### BREAKING CHANGES

* **forms:** Any input that we would also like to listen for `input`
will need this attribute added. This includes all `link-updater` and
`nomatch` inputs. ([9ecdb98](https://github.com/pivotal-cf/pivotal-ui/commits/9ecdb98))


