FROM ruby:2.7.4-slim-bullseye

# Install general packages
ENV PACKAGES build-essential libpq-dev netcat git apt-utils apt-transport-https curl wget unzip jq gnupg libfontconfig chrpath libssl-dev libxft-dev libfreetype6 libfreetype6-dev libfontconfig1 libfontconfig1-dev
RUN echo "Updating repos..." && apt-get update > /dev/null && \
    echo "Upgrading base packages..." && apt-get upgrade -y > /dev/null && \
    echo "Installing packages: ${PACKAGES}..." && apt-get install -y $PACKAGES --fix-missing --no-install-recommends > /dev/null && \
    echo "Done" && rm -rf /var/lib/apt/lists/*

# Configure/Install Postgres Repos/Deps
ENV PG_PACKAGES postgresql-client-12
RUN echo deb https://apt.postgresql.org/pub/repos/apt bullseye-pgdg main > /etc/apt/sources.list.d/bullseye-pgdg.list && \
    wget --quiet -O - https://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | apt-key add -
RUN echo "Updating repos..." && apt-get update > /dev/null && \
    echo "Installing posgres packages: ${PG_PACKAGES}..." && apt-get -t bullseye-pgdg install -y $PG_PACKAGES --fix-missing --no-install-recommends > /dev/null && \
    echo "Done." && rm -rf /var/lib/apt/lists/*

RUN wget -q https://deb.nodesource.com/setup_14.x -O nodesource_setup.sh && \
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
