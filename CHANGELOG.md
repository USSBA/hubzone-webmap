# Changelog
All notable changes to this project will be documented in this file.
## [3.1.0] - 2020-01-06
### updates to throttle API requests
## [3.0.2] - 2019-02-01
### shared-services-sprint-61
### Changed
  - HZINF-1763
    - Adding decrypt to parameterstore requests

## [3.0.1] - 2019-01-18
### shared-services-sprint-60
### Changed
  - IA-330
    - Switching assets docker configuration to use a shared asset image

## [3.0.0] - 2019-01-18
### shared-services-sprint-60
### Changed
  - HUB-1707
    - Reconfigured the webmap container to require pulling the HUBZONE_API_KEY from parameter-store

## [2.1.1] - 2019-01-04
### shared-services-sprint-59
### Changed
  - HUB-1723
    - Updated rails to 5.2.2 to address security concerns
    - Skip tests on poltergeist errors

## [2.1.0] - 2018-12-20
### shared-services-sprint-58
### Changed
  - HUB-1645
    - Updates map controls size to match Google's new size
  - HUB-1562
    - Fixes zoom controls not moving with the sidebar

## [2.0.5] - 2018-12-07
### shared-services-sprint-57
### Changed
  - HUB-1500
    - Added `strong_migrations` gem
  - HUB-1706
    - Added API key for requests to the HUBZone API

## [2.0.4] - 2018-11-23
### shared-services-sprint-56
### Changed
  - HUB-1678
    - Updated updated Gemfile/Gemfile.lock to use nokogiri >= 1.8.5, rack >= 2.0.6, and loofah >= 2.2.3.

## [2.0.3] - 2018-09-28
### shared-services-sprint-52
### Changed
  - HUB-1612
    - Updated start-rails and entrypoint scripts

## [2.0.2] - 2018-09-14
### shared-services-sprint-51
### Changed
  - HUB-1587
    - Updated ruby version in Dockerfiles
  - HUB-1550
    - Updated to ruby 2.5 and rails 5.2

## [2.0.1] - 2018-07-06
### shared-services-sprint-46
### Changed
  - HUB-1416
    - Updated sprockets gem
  - Added x-ray rails gem

## [2.0.0] - 2018-06-18
  - HUB-1377
    - v2.0.0 bump
  - Update Program link

## [1.7.8] - 2018-06-18
### hubzone-sprint-44
### Added
  - HUB-1379 updates logo mark

## [1.7.7] - 2018-04-13
### hubzone-sprint-40
### Added
  - HUB-1137
    - Sets up for codebuild.
    - moves the gm-sidebar-on test from rpsec to teaspoon - jasmine, cuz that is mo' betta'.

## [1.7.6] - 2018-01-19
### hubzone-sprint-34
### Changed
  - HUB-976 Updates help page to include new graphic and copy for base map switcher
### Fixes
  - HUB-1055 Fixes the panel not sliding out on Safari by adding a fallback for css `calc`.

## [1.7.5] - 2018-01-05
### hubzone-sprint-33
### Added
  - HUB-1031 Added and implemented secure_headers gem
  - HUB-1033 Adds in a Poirot pre-commit template and a rake task for adding this to the local users `.git/hooks` folder.
### Changed
  - HUB-1033 Tweaks the Poirot patterns a bit.

## [1.7.4] - 2017-12-22
### hubzone-sprint-32

Prepared repository for open source release.

### Added
  - LICENSE
  - CONTRIBUTING.md
  - code.json

## [1.7.3] - 2017-12-08
### hubzone-sprint-31
### Changed
  - HUB-984 Remove Google API keys from the config files -- use .env file instead

  - HUB-1004 Fixed bug where the 'Likely QDA' partial would not render if the `Congressional District` data was not present

## [1.7.2] - 2017-11-20
### hubzone-sprint-30
### Added
  - HUB-939 Add in a `patterns` file for poirot secrets testing.
### Changed
  - HUB-957 Move the map type picker so that it can be visible in mobile.

## [1.7.1] - 2017-10-27
### hubzone-sprint-28
### Added
  - HUB-927 Adds in the `Local Information` card to the sidebar and populates it with `Congressional District` data.

## [1.7.0] - 2017-10-12
### hubzone-sprint-27
### Added

  - HUB 864 Add "Likely Disaster" card to the side panel

### Changed

  - HUB 859
    - Updated gems and addressed rubocop concerns
