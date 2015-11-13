# If you modify this file, rebuild and push 
# remember to change tag in app dockerfile

FROM debian:jessie
MAINTAINER James Tarball <james.tarball@gmail.com>



# This code is inspired from the source code:
# https://github.com/smaato/docker-quickstart
# https://www.smaato.com/quickstart-a-web-development-stack-using-vagrant-docker/ 
# 

ENV DEBIAN_FRONTEND noninteractive
ENV APP_DIR /app
ENV BUILD_DIR /tmp
ENV ENV_TYPE dev

# Basic stuff...
RUN apt-get -yq update && \
    apt-get -yq install git curl net-tools sudo bzip2 libpng-dev locales-all \
        build-essential \
        postgresql-contrib \
        npm \
        vim \
        bash-completion \ 
        python-dev \
        python \
        python-pip \
        postgresql \
        python-psycopg2 \
        openssh-server \
        openssh-sftp-server

# Install node.js, then npm install yo and the generators
RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash - && \
    apt-get -yq install nodejs

RUN npm install -g npm@2.13.0 && \
    npm install -g gulp && \
    npm install -g yo@1.4.7 bower@1.4.1 gulp@3.9.0 && \
    npm install -g generator-polymer git://github.com/JTarball/generator-django-polymer.git

# grab gosu for easy step-down from root
RUN gpg --keyserver pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates wget && rm -rf /var/lib/apt/lists/* \
    && wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture)" \
    && wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture).asc" \
    && gpg --verify /usr/local/bin/gosu.asc \
    && rm /usr/local/bin/gosu.asc \
    && chmod +x /usr/local/bin/gosu

# Set the timezone.
RUN sudo echo "Europe/London" > /etc/timezone
RUN sudo dpkg-reconfigure -f noninteractive tzdata

# Add a yeoman user because grunt etc. doesn't like being root
RUN adduser --disabled-password --gecos "" yeoman && \
  echo "yeoman ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# set HOME so 'npm install' and 'bower install' don't write to /
ENV HOME /home/yeoman
ENV LANG en_GB.UTF-8

RUN mkdir -p $APP_DIR
RUN mkdir -p $BUILD_DIR
WORKDIR $APP_DIR

RUN chown yeoman:yeoman $APP_DIR
RUN chown yeoman:yeoman $BUILD_DIR

# Always run as the yeoman user - YO commands will not work otherwises!
USER yeoman

# To stop boiler-plate code, specify some on build commands
# 1. install pip requirements   - install requirements based on environment type (dev/production)
# 2. copy app folder            - code source code (you can then mount using docker-compose for development)
# 3. run initialise-project.py  - initialises a new project for you!
ONBUILD COPY requirements $BUILD_DIR/requirements
ONBUILD RUN sudo pip install -r $BUILD_DIR/requirements/$ENV_TYPE.txt
ONBUILD COPY app $APP_DIR

VOLUME $APP_DIR

CMD /bin/bash


