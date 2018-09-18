const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const User = require("./models/User");
const types = require("./config/apollo/types");
const { queryTypes, queryResolvers } = require("./config/apollo/queries.js");
const {
    mutationTypes,
    mutationResolvers
} = require("./config/apollo/mutations");
const db = require("./config/mongoose");
db();
// Construct a schema, using GraphQL schema language

const typeDefs = gql(types + queryTypes + mutationTypes);

// Provide resolver functions for your schema fields
const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers
};

const readToken = token => {
    // Do things
    return token;
};

const handleContext = ({ req }) => {
    const token = req.headers.authorization || "";
    const user_id = readToken(token);
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return { user: null };
    } else {
        return User.findOne({ _id: token }).then(u => ({ user: u }));
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: handleContext
});

const app = express();
app.get("/resetDb", require("./resetDb"));
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
