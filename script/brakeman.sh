#!/bin/bash
#
# Script for running Brakeman tests
# Brakeman is a security scanner https://github.com/presidentbeef/brakeman.

gem install --no-rdoc --no-ri brakeman
brakeman --exit-on-warn .