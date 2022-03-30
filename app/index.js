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

const myPlugin = {
    // Fires whenever a GraphQL request is received from a client.
    async requestDidStart(requestContext) {
      console.log('Request started! Query:\n' +
        requestContext.request.query);
  
      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        async parsingDidStart(requestContext) {
          console.log('Parsing started!');
        },
  
        // Fires whenever Apollo Server will validate a
        // request's document AST against your GraphQL schema.
        async validationDidStart(requestContext) {
          console.log('Validation started!');
        },
  
      }
    },
  };

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  plugins: [myPlugin],
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
