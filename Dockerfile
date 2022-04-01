FROM node:node:16.3.0-slim

# Create app directory
WORKDIR /app

COPY yarn.lock ./
COPY package*.json ./

RUN yarn install

COPY . .
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 5002
ENTRYPOINT ["/docker-entrypoint.sh"]
