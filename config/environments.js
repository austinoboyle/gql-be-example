require("dotenv-flow").config();
let MONGO_CONNECTION_STRING = "mongodb://127.0.0.1/graphql";
if (process.env.MONGO_URL !== undefined) {
    MONGO_CONNECTION_STRING = `mongodb://${process.env.MONGO_USER}:${
        process.env.MONGO_PASS
    }@${process.env.MONGO_URL}`;
}
console.log("CONNECTION STRING", MONGO_CONNECTION_STRING);
const baseConfig = {
    app: { name: "graphql-api" },
    db: MONGO_CONNECTION_STRING
};
module.exports = {
    //MongoDB configuration
    development: baseConfig,
    test: baseConfig,
    production: baseConfig
};
