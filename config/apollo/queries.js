const User = require("../../models/User");
const Shop = require("../../models/Shop");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");

exports.queryTypes = `
type Query {
    "Get users by username, id, or access level"
    users(id: ID, username: String, access: Access): [User!]
    shops(id: ID, name: String): [Shop!]
    products(id: ID, name: String): [Product!]
    carts(id: ID, user_id: ID, shop_id: ID): [Cart!]
    orders(id: ID, user_id: ID, shop_id: ID): [Order!]
}
`;

const users = (obj, { id, username, access }, context, info) => {};

const shops = (obj, { id, name }, context, info) => {};

const products = (obj, { id, name }, context, info) => {};

const carts = (obj, { id, user_id, shop_id }) => {};

const orders = (obj, { id, user_id, shop_id }) => {};

exports.queryResolvers = {
    users,
    shops,
    products,
    carts,
    orders
};
