FROM node:alpine

ENV CHOKIDAR_USEPOLLING true

WORKDIR /app

EXPOSE 8080

CMD [ "yarn", "run", "start" ]