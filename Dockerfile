FROM ruby:2.5-slim-stretch as webmap-base

# Install general packages
ENV PACKAGES build-essential libpq-dev netcat git python python-pip python-dev apt-utils apt-transport-https curl wget unzip jq gnupg
RUN echo "Updating repos..." && apt-get update > /dev/null && \
    echo "Installing packages: ${PACKAGES}..." && apt-get install -y $PACKAGES --fix-missing --no-install-recommends > /dev/null && \
    echo "Done" && rm -rf /var/lib/apt/lists/*

# Install aws-cli
RUN echo "Fetching awscli installer..." && wget -qO "awscli-bundle.zip" "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" && \
    echo "Unpacking..." && unzip awscli-bundle.zip > /dev/null && \
    echo "Installing awscli..." && ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws > /dev/null && \
    echo "Done" && rm -rf awscli-bundle awscli-bundle.zip

# Configure/Install Postgres Repos/Deps
ENV PG_PACKAGES postgresql-9.6 postgresql-9.6-postgis-2.4
RUN echo deb https://apt.postgresql.org/pub/repos/apt stretch-pgdg main > /etc/apt/sources.list.d/stretch-pgdg.list && \
    wget --quiet -O - https://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -
RUN echo "Updating repos..." && apt-get update > /dev/null && \
    echo "Installing posgres packages: ${PG_PACKAGES}..." && apt-get -t stretch-pgdg install -y $PG_PACKAGES --fix-missing --no-install-recommends > /dev/null && \
    echo "Done." && rm -rf /var/lib/apt/lists/*


#Install javascript runtime
RUN wget -q https://deb.nodesource.com/setup_6.x -O nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -qq -y nodejs --fix-missing --no-install-recommends && \
    echo "Done." && rm nodesource_setup.sh && rm -rf /var/lib/apt/lists/*

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

RUN mkdir -p tmp/pids

# Cache the bundle install
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN bundle install --quiet

COPY . .

ENV RAILS_LOG_TO_STDOUT true

# Setup Entrypoint
RUN cp ./docker/entrypoint.sh ./docker/start-rails.sh /usr/bin/ && chmod 555 /usr/bin/entrypoint.sh && chmod 555 /usr/bin/start-rails.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["start-rails.sh"]

EXPOSE 3000

FROM webmap-base as webmap-test

# Install Chromedriver & chrome
ENV PACKAGES xvfb google-chrome-stable chromedriver

RUN echo "Creating user to run headless chrome..." && useradd svc.chrome && \
    mkdir -p /home/svc.chrome && chown svc.chrome:svc.chrome /home/svc.chrome

RUN echo "Installing chrome..." && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN echo "Updating repos..." && apt-get update -y && apt-get -y install $PACKAGES && \
    echo "Done" && rm -rf /var/lib/apt/lists/*
RUN echo 'export PATH="~/bin/:$PATH"' >> ~/.bash_profile

EXPOSE 4444

ENTRYPOINT ["entrypoint.sh"]
CMD ["start-rails.sh"]


#COPY bootstrap.sh /

#CMD ['/bootstrap.sh']




