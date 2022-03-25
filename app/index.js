const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressJwt = require("express-jwt");
const { readFileSync } = require('fs');
const config = require('../config/default');

const port = 5002;
const app = express();

const publicKey = readFileSync('./keys/oauth-public.key');

app.use(
  expressJwt({
    secret: publicKey,
    algorithms: ["RS256"],
    credentialsRequired: false
  })
);

const gateway = new ApolloGateway({
  serviceList: config.services,
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set(
          "user",
          context.user ? JSON.stringify(context.user) : null
        );

        request.http.headers.set(
          "Authorization",
          context.auth ? context.auth : null
        );
      }
    });
  }
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const user = req.user || null;
    const auth = req.headers.authorization || null;
    return { user, auth };
  }
});

server.applyMiddleware({ app });

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);
