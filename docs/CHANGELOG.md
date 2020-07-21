## [1.0.1](https://github.com/newrelic/nr1-status-pages/compare/v1.0.0...v1.0.1) (2020-07-21)


### Bug Fixes

* initialize networkResponse. Trigger release and changelog generation (via GitHub Actions) ([8d12a37](https://github.com/newrelic/nr1-status-pages/commit/8d12a3707f179aeff919588827cad28d55f42ac2))

# [1.0.0](https://github.com/newrelic/nr1-status-pages/compare/v0.17.0...v1.0.0) (2020-07-21)


### chore

* **release:** updating to 1.0.0 ([c733d1f](https://github.com/newrelic/nr1-status-pages/commit/c733d1f61b6cb76afbfb88cf3013a907efd38c29))


### BREAKING CHANGES

* **release:** NRQL cards, RSS cards, CORS proxy support, and bug fixes

# [0.17.0](https://github.com/newrelic/nr1-status-pages/compare/v0.16.0...v0.17.0) (2020-07-21)


### Bug Fixes

* encodeuri added ([920d0f0](https://github.com/newrelic/nr1-status-pages/commit/920d0f0623ad58b944c7be7b50ce4c755475dff1))
* external page open in new card ([1a2545a](https://github.com/newrelic/nr1-status-pages/commit/1a2545a5c8b631c6d002a4d0abc4a21c07fd7028))
* provider select in edit fixed ([59f49b3](https://github.com/newrelic/nr1-status-pages/commit/59f49b3e649300d3e0eb5af4844043db3abdfb28))
* small code refactors ([3bc9c5d](https://github.com/newrelic/nr1-status-pages/commit/3bc9c5d3d79f8ec224874f2715139d876449723d))
* unnecessary code removed ([bedc5d1](https://github.com/newrelic/nr1-status-pages/commit/bedc5d1f65b443b42d2bf00476f9ab1e383e74b8))


### Features

* cors address configuration added ([7307f61](https://github.com/newrelic/nr1-status-pages/commit/7307f614703c3ef7318e70d03319e432bcd18e01))
* readme updated and default url added ([5b4abb9](https://github.com/newrelic/nr1-status-pages/commit/5b4abb905512bd2d262283f90d443b47d37e7a1b))

# [0.16.0](https://github.com/newrelic/nr1-status-pages/compare/v0.15.0...v0.16.0) (2020-07-17)


### Features

* rss feed added as provider ([7d54f41](https://github.com/newrelic/nr1-status-pages/commit/7d54f412d44e073593bc7f78e436c6d79628a97a))
* rss feed added as provider ([2ce9cff](https://github.com/newrelic/nr1-status-pages/commit/2ce9cffd4567bcd105eb25db688168d8efcdec8a))

# [0.15.0](https://github.com/newrelic/nr1-status-pages/compare/v0.14.0...v0.15.0) (2020-07-16)


### Bug Fixes

* polling data optimization ([9ba5c19](https://github.com/newrelic/nr1-status-pages/commit/9ba5c19a5fc2ea1748e0c87cec6291b698a0d9a4))
* polling data optimization and unique key fixed ([df0f54d](https://github.com/newrelic/nr1-status-pages/commit/df0f54defc3f0822abf7ee030c6c2addfd402cd7))


### Features

* fetching incidents with nrql query ([fc8215a](https://github.com/newrelic/nr1-status-pages/commit/fc8215a584488f8b058de1fc10c834f72afa0a33))
* nrql handled in create new service form ([af56bd4](https://github.com/newrelic/nr1-status-pages/commit/af56bd45e75084fd831566c21c4b1c6513be9370))
* readme update for nrql query ([0bc175b](https://github.com/newrelic/nr1-status-pages/commit/0bc175bdafb4916e1b6cb5c118265293e10329b6))
* validation for nrql query added ([9641982](https://github.com/newrelic/nr1-status-pages/commit/964198204116bc74b9d26f600d18b007f767e01d))
* validation for nrql query added ([df7b690](https://github.com/newrelic/nr1-status-pages/commit/df7b690966eea245100334e871577d5494357698))

# [0.14.0](https://github.com/newrelic/nr1-status-pages/compare/v0.13.0...v0.14.0) (2020-07-14)


### Bug Fixes

* solved problem with incidents that doesn't expand on incidents list ([ec639af](https://github.com/newrelic/nr1-status-pages/commit/ec639af50f3b13385144065a6e3e02a19be8ea52))


### Features

* Added input validation, new TextField wrapper and styling ([e67e631](https://github.com/newrelic/nr1-status-pages/commit/e67e631d7898c620e094e74e6fd5fc7ddf17d75c))
* added temporary way of handling CORS problems ([81bde93](https://github.com/newrelic/nr1-status-pages/commit/81bde935e1fcc28d42e6acfcb93aaeb37d2965d6))
* Added validation in order to prevent creating status pages with incorrect StatusIO urls ([0a4148d](https://github.com/newrelic/nr1-status-pages/commit/0a4148d2916663e33461804698e293077e15cdfa))
* Added validation in order to prevent creating status pages with incorrect StatusIO urls ([e385bf3](https://github.com/newrelic/nr1-status-pages/commit/e385bf39a18e7375c9170bc39c442d7441f8fdbe))
* adjusted saving validation ([2413b22](https://github.com/newrelic/nr1-status-pages/commit/2413b22238c46a91d37fe5edfb18697f81fe14b5))
* informing user that there is an error while downloading page info or provided url is incorrect ([4f5d347](https://github.com/newrelic/nr1-status-pages/commit/4f5d347514de1e6d41dc4da3bcabb43f0cc97b43))
* validation adjustments code cleanup ([f1a37e1](https://github.com/newrelic/nr1-status-pages/commit/f1a37e184c21404e88eff9722d540b8395eee35b))
* validation adjustments code cleanup ([9ff7c39](https://github.com/newrelic/nr1-status-pages/commit/9ff7c39965c31792babb1d304b99dc76de3a38a0))

# [0.13.0](https://github.com/newrelic/nr1-status-pages/compare/v0.12.3...v0.13.0) (2020-07-10)


### Bug Fixes

* breakpoint for desktop added ([57e0cb0](https://github.com/newrelic/nr1-status-pages/commit/57e0cb0d7088a67c03fb545f9302ddcdf30a2310))
* edit hostname fixed ([d16f924](https://github.com/newrelic/nr1-status-pages/commit/d16f9244664e823744d19384116f2cd606b36999))
* fixed incorrect behavior on Safari when adding new service and refactored part of the code ([1fdd2d8](https://github.com/newrelic/nr1-status-pages/commit/1fdd2d89420cc32169628937327f109da7c0e9eb))
* Fixed possibility of adding new status page by fixing provider setting ([55952cb](https://github.com/newrelic/nr1-status-pages/commit/55952cb676a9f4e5087d288c071d1c584d4235e2))
* nerdpack id reverted ([547ad85](https://github.com/newrelic/nr1-status-pages/commit/547ad85a73f9819156260e2939de05ca093b842b))
* refresh rate for timeline fixed ([946f951](https://github.com/newrelic/nr1-status-pages/commit/946f95188e740b01ca621e3e6e30a593f1be4b33))
* refreshing timeline fixed ([c8b5a5c](https://github.com/newrelic/nr1-status-pages/commit/c8b5a5cf8ebc28c1ec93f9ed4a1decd401c5b21e))
* setting dropdown visible fix ([f02a44a](https://github.com/newrelic/nr1-status-pages/commit/f02a44a5d44001378c38d8c0a497121633146b81))
* setting dropdown visible fix ([a9a3dad](https://github.com/newrelic/nr1-status-pages/commit/a9a3dad86560cc648bb0694436c8991894f999b7))
* updating to latest version of semantic release plugins ([0a8d049](https://github.com/newrelic/nr1-status-pages/commit/0a8d049348699110dcf46c0bcb962e5a0cb9103f))
* variable name changed ([f7157b1](https://github.com/newrelic/nr1-status-pages/commit/f7157b133ed7cb9b2e3a97b718b5474f9a6387f1))


### Features

* Trigger patch release to get semantic-release back on track ([1ccc693](https://github.com/newrelic/nr1-status-pages/commit/1ccc6938903a08dbcd429634da5f35d2cb879d07))

## [0.12.4](https://github.com/newrelic/nr1-status-pages/compare/v0.12.3...v0.12.4) (2020-07-10)


### Bug Fixes

* breakpoint for desktop added ([57e0cb0](https://github.com/newrelic/nr1-status-pages/commit/57e0cb0d7088a67c03fb545f9302ddcdf30a2310))
* edit hostname fixed ([d16f924](https://github.com/newrelic/nr1-status-pages/commit/d16f9244664e823744d19384116f2cd606b36999))
* fixed incorrect behavior on Safari when adding new service and refactored part of the code ([1fdd2d8](https://github.com/newrelic/nr1-status-pages/commit/1fdd2d89420cc32169628937327f109da7c0e9eb))
* Fixed possibility of adding new status page by fixing provider setting ([55952cb](https://github.com/newrelic/nr1-status-pages/commit/55952cb676a9f4e5087d288c071d1c584d4235e2))
* nerdpack id reverted ([547ad85](https://github.com/newrelic/nr1-status-pages/commit/547ad85a73f9819156260e2939de05ca093b842b))
* refresh rate for timeline fixed ([946f951](https://github.com/newrelic/nr1-status-pages/commit/946f95188e740b01ca621e3e6e30a593f1be4b33))
* refreshing timeline fixed ([c8b5a5c](https://github.com/newrelic/nr1-status-pages/commit/c8b5a5cf8ebc28c1ec93f9ed4a1decd401c5b21e))
* setting dropdown visible fix ([f02a44a](https://github.com/newrelic/nr1-status-pages/commit/f02a44a5d44001378c38d8c0a497121633146b81))
* setting dropdown visible fix ([a9a3dad](https://github.com/newrelic/nr1-status-pages/commit/a9a3dad86560cc648bb0694436c8991894f999b7))
* updating to latest version of semantic release plugins ([0a8d049](https://github.com/newrelic/nr1-status-pages/commit/0a8d049348699110dcf46c0bcb962e5a0cb9103f))
* variable name changed ([f7157b1](https://github.com/newrelic/nr1-status-pages/commit/f7157b133ed7cb9b2e3a97b718b5474f9a6387f1))

## [0.12.3](https://github.com/newrelic/nr1-status-pages/compare/v0.12.2...v0.12.3) (2020-07-07)


### Bug Fixes

* upgrade axios from 0.19.0 to 0.19.2 ([c4edf5e](https://github.com/newrelic/nr1-status-pages/commit/c4edf5ef4ac694e2f7aef7640e5ed66b55d9339d))
* upgrade axios from 0.19.0 to 0.19.2 ([a073197](https://github.com/newrelic/nr1-status-pages/commit/a07319721891d061849cd67bde7a47a440f1baea))
* upgrade dayjs from 1.8.17 to 1.8.28 ([f7ea7c7](https://github.com/newrelic/nr1-status-pages/commit/f7ea7c7813e3fab71fd97f100df1b2cfff270a22))
* upgrade react-markdown from 4.2.2 to 4.3.1 ([9bf4e5f](https://github.com/newrelic/nr1-status-pages/commit/9bf4e5f80bdb5e47ce0fdc770f9dc2ab26ade817))
* upgrade uuid from 3.3.3 to 3.4.0 ([17e4a9d](https://github.com/newrelic/nr1-status-pages/commit/17e4a9d84dc043ee77e1b7fc1940f5744cf5f3ec))
* upgrade uuid from 3.3.3 to 3.4.0 ([5887c1d](https://github.com/newrelic/nr1-status-pages/commit/5887c1d97c5cdbc7ffc057f25f1da7a8059223e4))
* upgrade vertical-timeline-component-for-react from 1.0.6 to 1.0.7 ([c14dbb6](https://github.com/newrelic/nr1-status-pages/commit/c14dbb6bb2d52326f98c881db561fe092713ea2f))
* upgrade vertical-timeline-component-for-react from 1.0.6 to 1.0.7 ([1509755](https://github.com/newrelic/nr1-status-pages/commit/1509755ea635c8842ca3b7e8040dc9a598269c34))

## [0.12.2](https://github.com/newrelic/nr1-status-pages/compare/v0.12.1...v0.12.2) (2020-03-31)


### Bug Fixes

* implement uuid. ([a0bea83](https://github.com/newrelic/nr1-status-pages/commit/a0bea83bfed455de708b6a9f44869f99f4d5eda0))
* remove confusing inline eslint rule. Simplify the code. ([1afa80b](https://github.com/newrelic/nr1-status-pages/commit/1afa80b6899e23a84516cc13e9a7d79d2283e495))
* swap out Dropdown for select ([e470234](https://github.com/newrelic/nr1-status-pages/commit/e4702340536023a2097b707171896eefabe40087))
* swaps another dropdown for vanilla select ([fa03eef](https://github.com/newrelic/nr1-status-pages/commit/fa03eef0e871006b5ebbc1762f017be37bcf1fa6))
* unused binding calls. ([c1deae9](https://github.com/newrelic/nr1-status-pages/commit/c1deae90b4c357bb8327a0139052459e22d061b8))

## [0.12.1](https://github.com/newrelic/nr1-status-pages/compare/v0.12.0...v0.12.1) (2020-03-27)


### Bug Fixes

* Make popover menu disappear onMouseLeave ([#46](https://github.com/newrelic/nr1-status-pages/issues/46)) ([6043ae0](https://github.com/newrelic/nr1-status-pages/commit/6043ae0706fbd621fdd49286f3b393d01a50a3fd)), closes [newrelic#42](https://github.com/newrelic/issues/42)

# [0.12.0](https://github.com/newrelic/nr1-status-pages/compare/v0.11.1...v0.12.0) (2020-03-06)


### Features

* **catalog:** add app icon into root directory ([5d360d0](https://github.com/newrelic/nr1-status-pages/commit/5d360d0f9b719ad3c5b21ddc90fba14288a9ef39))

## [0.11.1](https://github.com/newrelic/nr1-status-pages/compare/v0.11.0...v0.11.1) (2020-03-06)


### Bug Fixes

* **catalog:** update commands in README ([44742d7](https://github.com/newrelic/nr1-status-pages/commit/44742d7bfddfe24457daa3ec2bec455261822de6)), closes [newrelic#44](https://github.com/newrelic/issues/44)
* **chore:** update nr1.json description ([c68abb3](https://github.com/newrelic/nr1-status-pages/commit/c68abb342633c45021c2b92116fd7f1347bfb759))

# [0.11.0](https://github.com/newrelic/nr1-status-pages/compare/v0.10.1...v0.11.0) (2019-12-13)


### Features

* add support for status io provider ([#29](https://github.com/newrelic/nr1-status-pages/issues/29)) ([ef460e4](https://github.com/newrelic/nr1-status-pages/commit/ef460e43c4b2ca81fe94b0055c1a194d5604bf36))

## [0.10.1](https://github.com/newrelic/nr1-status-pages/compare/v0.10.0...v0.10.1) (2019-12-13)


### Bug Fixes

* adjust spacing around status pages container ([059be09](https://github.com/newrelic/nr1-status-pages/commit/059be095bddf13fd90a6c656d3370fb795269725))
* prioritize css overrides over defaults ([be55c83](https://github.com/newrelic/nr1-status-pages/commit/be55c83f48a368df60c35f55a5a43c93c94b9842))

# [0.10.0](https://github.com/newrelic/nr1-status-pages/compare/v0.9.0...v0.10.0) (2019-11-26)


### Bug Fixes

* add package-lock.json to VCS ([#31](https://github.com/newrelic/nr1-status-pages/issues/31)) ([db53df8](https://github.com/newrelic/nr1-status-pages/commit/db53df85fc316eea05357d0d0a97979e7f1f950c))
* quick start dropdown now behaves properly ([cf05eec](https://github.com/newrelic/nr1-status-pages/commit/cf05eecf4d4ead835a1766f6314749914435d82a))


### Features

* circleci and semantic-release ([#28](https://github.com/newrelic/nr1-status-pages/issues/28)) ([602cb06](https://github.com/newrelic/nr1-status-pages/commit/602cb064ffe9c1375dfce1c471cf0a54d27a568b))
