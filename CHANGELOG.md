# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [5.0.1](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v5.0.0...v5.0.1) (2021-04-06)

## [5.0.0](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v4.0.1...v5.0.0) (2021-01-19)


### ⚠ BREAKING CHANGES

* rename customOptionsFactory to resizeLoaderOptionsGenerator
* remove webpack-query-loader support

### Features

* remove webpack-query-loader support ([43ff24c](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/43ff24c425929356ce3112b6101fee1cba27299e))
* rename customOptionsFactory to optionsGenerator ([678af94](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/678af94442c16105855d24c91c3184508546f6a8))
* rename customOptionsFactory to resizeLoaderOptionsGenerator ([c5199d7](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/c5199d7d62dea4841371ff24ddebe46436541122))


### Bug Fixes

* fix typos in options.json ([3c2014a](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/3c2014a580be085d5b395854803cc06bd13321d4))
* fix typos in options.json ([4a81bee](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/4a81beed79247a9290466167ae3a318472802637))

### [4.0.1](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v4.0.0...v4.0.1) (2020-12-24)


### Bug Fixes

* inline loader options not being parsed correctly ([7ed891c](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/7ed891c04355f1346001e45000b631ab56b177a1))

## [4.0.0](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v3.0.3...v4.0.0) (2020-12-18)


### ⚠ BREAKING CHANGES

* null is no longer allowed as a size, replaced by `"original"`

### Features

* null is no longer allowed as a size, replaced by `"original"` ([f1c1049](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/f1c10498093c0fd6ae3594002a0b0dafa7dbc535))

### [3.0.3](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v3.0.2...v3.0.3) (2020-12-14)

### [3.0.2](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v3.0.1...v3.0.2) (2020-11-29)

### [3.0.1](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v3.0.0...v3.0.1) (2020-11-03)

## [3.0.0](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v2.0.0...v3.0.0) (2020-09-02)

### ⚠ BREAKING CHANGES

- **deps:** Update to [sharp@0.26](https://sharp.pixelplumbing.com/changelog#v026---zoom)

- **deps:** update packages ([9be971b](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/9be971bd78ad1063f033f297a75d59e3f2bb37c4))

## [2.0.0](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v1.0.2...v2.0.0) (2020-06-24)

### ⚠ BREAKING CHANGES

- if a width in `sizes` is greater than the original width of the image, it will now
  be skipped by default
- default import format is now ES modules instead of CommonJS modules

### Features

- add esModule option ([1c18e0f](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/1c18e0f18bcfa33b58025c092720c02e36fa26d2))
- add scaleUp option ([7f90206](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/7f90206a743f0b3436b223d77d6422fd7ac26161))

### [1.0.2](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v1.0.1...v1.0.2) (2020-06-23)

### [1.0.1](https://github.com/Calvin-LL/webpack-image-srcset-loader/compare/v1.0.0...v1.0.1) (2020-06-23)

### Bug Fixes

- options not correctly formatted when passing to webpack-query-loader ([23f2d7a](https://github.com/Calvin-LL/webpack-image-srcset-loader/commit/23f2d7ad974a09d521f6abdaeb1c171cad07fad8))

## 1.0.0 (2020-06-23)
