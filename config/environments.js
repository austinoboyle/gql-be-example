require("dotenv-flow").config();
const MONGO_CONNECTION_STRING = `mongodb://${process.env.MONGO_USER}:${
    process.env.MONGO_PASS
}@${process.env.MONGO_URL}`;
console.log("CONNECTION STRING", MONGO_CONNECTION_STRING);
module.exports = {
    //MongoDB configuration
    development: {
        db: "mongodb://127.0.0.1/graphql",
        app: {
            name: "graphql"
        }
    },
    test: {
        db: process.env.REMOTE_TEST_DB
            ? MONGO_CONNECTION_STRING
            : "mongodb://127.0.0.1/graphql-test",
        app: {
            name: "graphql"
        }
    },
    production: {
        db: MONGO_CONNECTION_STRING,
        app: {
            name: "graphql"
        }
    }
};
