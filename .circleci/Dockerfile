FROM ruby:2.3.3-slim

RUN echo deb http://ftp.debian.org/debian jessie-backports main > /etc/apt/sources.list.d/jessie-backports.list

ENV PACKAGES build-essential libpq-dev netcat git curl
ENV BACKPORT_PACKAGES postgresql-client-9.6

RUN apt-get update && apt-get install -qq -y $PACKAGES --fix-missing --no-install-recommends
RUN apt-get -t jessie-backports install -qq -y $BACKPORT_PACKAGES --fix-missing --no-install-recommends
RUN gem install bundler

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -qq -y nodejs --fix-missing --no-install-recommends
RUN npm install -g yarn
