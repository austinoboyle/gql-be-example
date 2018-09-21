const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const User = require("./models/User");
const db = require("./config/mongoose");
const { schema } = require("./config/apollo");
const resetDb = require("./resetDb");
db();

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
    schema,
    playground: true,
    uploads: false,
    context: handleContext
});

const app = express();
app.get("/resetDb", (req, res) => {
    resetDb().then(
        success => (success ? res.send("Success!") : res.send("FAIL!"))
    );
});
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
