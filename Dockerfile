FROM node:latest

MAINTAINER: chewey

COPY . /var/www

WORKDIR /var/www


EXPOSE 3000

ENTRYPOINT ["node", "index.js"]

