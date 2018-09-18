const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const types = require("./config/apollo/types");
const { queryTypes, queryResolvers } = require("./config/apollo/queries.js");
const db = require("./config/mongoose");
db();
// Construct a schema, using GraphQL schema language

const typeDefs = gql(types + queryTypes);

// Provide resolver functions for your schema fields
const resolvers = {
    Query: queryResolvers
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
