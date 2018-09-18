module.exports = {
    //MongoDB configuration
    development: {
        db: "mongodb://127.0.0.1/graphql",
        app: {
            name: "graphql"
        }
    },
    test: {
        db: "mongodb://127.0.0.1/graphql-test",
        app: {
            name: "graphql"
        }
    },
    production: {
        db: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${
            process.env.MONGO_URL
        }`,
        app: {
            name: "graphql"
        }
    }
};
