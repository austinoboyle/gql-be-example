const mongoose = require("mongoose");
const resetDb = require("../../resetDb");
const { schema } = require("../apollo");
const { graphql } = require("graphql");

exports.setup = done => {
    resetDb().then(() => done());
};

exports.end = done => {
    resetDb()
        .then(() => mongoose.disconnect())
        .then(() => done());
};

exports.graphQLQuery = (query, context = null) => {
    return graphql(schema, query, null, context);
};

exports.mutation = q => `mutation{${q}}`;
exports.query = q => `query{${q}}`;

exports.admin_id = "111111111111111111111111";
exports.user_id = "111111111111111111111112";
exports.owner_ids = [
    "111111111111111111111114",
    "111111111111111111111115",
    "111111111111111111111116"
];
exports.shop_ids = [
    "211111111111111111111111",
    "211111111111111111111112",
    "211111111111111111111113"
];
