const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server-express");

const express = require("express");
const expressJwt = require("express-jwt");
const { readFileSync } = require('fs');
const config = require('../config/default');
const promMid = require('express-prometheus-middleware');

const { createPrometheusExporterPlugin } = require('@bmatei/apollo-prometheus-exporter')
const port = 5002;
const app = express();

const publicKey = readFileSync('./keys_back/oauth-public.key');
const prometheusExporterPlugin = createPrometheusExporterPlugin({ app });

app.use(
    expressJwt({
        secret: publicKey,
        algorithms: ["RS256"],
        credentialsRequired: false
    }),
    promMid({
        metricsPath: '/metrics',
        collectDefaultMetrics: false,
        requestDurationBuckets: [0.1, 0.5, 1, 1.5],
        requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
        responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
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

const errorEncounterPlugin = {
    requestDidStart({ context }) {
      return {
        async didEncounterErrors({ errors }) {
          console.log(errors);
        }
      };
    }
  };

const server = new ApolloServer({
    gateway,
    graphqlPath: "ptvapi",
    subscriptions: false,
    plugins: [
        prometheusExporterPlugin,
        errorEncounterPlugin
    ],
    context: ({ req }) => {
        const user = req.user || null;
        const auth = req.headers.authorization || null;
        return { user, auth };
    }
});

server.applyMiddleware({ app , path: '/ptvapi'});
// server.applyMiddleware({ app });

app.listen({ port }, () =>
    console.log(`Server ready at :${port}${server.graphqlPath}`)
);
