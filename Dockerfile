FROM node:16

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 5002
ENTRYPOINT ["/docker-entrypoint.sh"]
