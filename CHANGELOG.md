# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

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
