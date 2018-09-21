/**
 * Custom GraphQL Query Types and Resolvers
 * @module queries
 */

const User = require("../../models/User");
const Shop = require("../../models/Shop");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");

const { createQuery, populateTotals } = require("../../utils");

/**
 * Documentation/Definitions for Query Types
 * @type {String}
 */
exports.queryTypes = `
type Query {
    "Get users by username, id, or access level"
    users(id: ID, username: String, access: Access): [User!]
    shops(id: ID, name: String, product_id: ID): [Shop!]
    products(id: ID, name: String, tag: String): [Product!]
    carts(id: ID, user_id: ID, shop_id: ID): [Cart!]
    orders(id: ID, user_id: ID, shop_id: ID): [Order!]
}
`;

/**
 * Query Users
 *
 * @param {*} obj unused
 * @param {*} query { id:String, username:String, access:String }
 * @returns {Promise} resolves to array of Users
 */
const users = (obj, { id, username, access }, context, info) => {
    return User.find(createQuery({ _id: id, username, access }));
};

/**
 * Query Shops
 *
 * @param {*} obj unused
 * @param {*} query { id:String, name:String, product_id:String }
 * @returns {Promise} resolves to array of Shops
 */
const shops = (obj, { id, name, product_id }, context, info) => {
    return Shop.find(createQuery({ _id: id, name, products: product_id }))
        .populate("products")
        .populate("owners")
        .exec();
};

/**
 * Query products
 *
 * @param {*} obj unused
 * @param {*} query { id:String, name:String, tag:String }
 * @returns {Promise} resolves to array of Products
 */
const products = (obj, { id, name, tag }, context, info) => {
    if (tag !== null && tag !== undefined) {
        tag = tag.toLowerCase();
    }
    return Product.find(createQuery({ _id: id, name, tags: tag }));
};

/**
 * Query carts
 *
 * @param {*} obj unused
 * @param {*} query { id:String, user_id:String, shop_id:String }
 * @returns {Promise} resolves to array of Carts
 */
const carts = (obj, { id, user_id, shop_id }) => {
    return Cart.find(createQuery({ _id: id, user: user_id, shop: shop_id }))
        .populate("items.product")
        .exec()
        .then(carts => carts.map(populateTotals));
};

/**
 * Query orders
 *
 * @param {*} obj unused
 * @param {*} query { id:String, user_id:String, shop_id:String }
 * @returns {Promise} resolves to array of Orders
 */
const orders = (obj, { id, user_id, shop_id }) => {
    return Order.find(createQuery({ _id: id, user: user_id, shop: shop_id }));
};

/**
 * Exported object containing all query Resolvers
 * {users, shops, products, carts, orders}
 * @type {Object}
 */
exports.queryResolvers = {
    users,
    shops,
    products,
    carts,
    orders
};
