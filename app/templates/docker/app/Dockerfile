FROM jtarball/docker-base:latest
MAINTAINER James Tarball <james.tarball@gmail.com>

ENV ENV_TYPE dev
ENV APP_DIR /app

#ENTRYPOINT cp -r /app /src
    #sudo pip install -r /requirements/$ENV_TYPE.txt && \
    #psql -u root -proot -Bse "CREATE DATABASE IF NOT EXISTS backend;" && \

COPY docker-entrypoint.sh /entrypoint.sh
RUN sudo chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

#EXPOSE ["8000", "3000", "3001"]

CMD ["app"]
