FROM ruby:2.5-slim-stretch

RUN echo deb http://ftp.debian.org/debian jessie-backports main > /etc/apt/sources.list.d/jessie-backports.list

ENV DEBIAN_FRONTEND noninteractive
ENV PACKAGES build-essential libpq-dev netcat git libfontconfig python3 python-pip python-dev apt-utils apt-transport-https curl wget unzip jq gnupg
ENV BACKPORT_PACKAGES postgresql-client-9.6

RUN apt-get update && apt-get install -qq -y $PACKAGES --fix-missing --no-install-recommends
RUN apt-get -t jessie-backports install -qq -y $BACKPORT_PACKAGES --fix-missing --no-install-recommends
RUN gem install bundler

RUN curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -qq -y nodejs --fix-missing --no-install-recommends
RUN npm init -y

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo deb https://dl.yarnpkg.com/debian/ stable main | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
RUN apt-get autoremove -y

RUN npm install -g jshint
RUN npm install -g istanbul

RUN pip install -U pip
RUN pip install poirot

RUN wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
RUN tar -xf phantomjs-2.1.1-linux-x86_64.tar.bz2
RUN rm phantomjs-2.1.1-linux-x86_64.tar.bz2
RUN mv phantomjs-2.1.1-linux-x86_64/bin/phantomjs /bin
RUN rm -r phantomjs-2.1.1-linux-x86_64
