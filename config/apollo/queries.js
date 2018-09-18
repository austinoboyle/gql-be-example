const User = require("../../models/User");
const Shop = require("../../models/Shop");
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");

const { createQuery, populateTotals } = require("../../utils");

exports.queryTypes = `
type Query {
    "Get users by username, id, or access level"
    users(id: ID, username: String, access: Access): [User!]
    shops(id: ID, name: String, product_id: ID): [Shop!]
    products(id: ID, name: String): [Product!]
    carts(id: ID, user_id: ID, shop_id: ID): [Cart!]
    orders(id: ID, user_id: ID, shop_id: ID): [Order!]
}
`;

const users = (obj, { id, username, access }, context, info) => {
    return User.find(createQuery({ _id: id, username, access }));
};

const shops = (obj, { id, name, product_id }, context, info) => {
    return Shop.find(createQuery({ _id: id, name, products: product_id }))
        .populate("products")
        .populate("owners")
        .exec();
};

const products = (obj, { id, name }, context, info) => {
    return Product.find(createQuery({ _id: id, name }));
};

const carts = (obj, { id, user_id, shop_id }) => {
    return Cart.find(createQuery({ _id: id, user: user_id, shop: shop_id }))
        .populate("items.product")
        .exec()
        .then(carts => carts.map(populateTotals));
};

const orders = (obj, { id, user_id, shop_id }) => {
    return Order.find(createQuery({ _id: id, user: user_id, shop: shop_id }));
};

exports.queryResolvers = {
    users,
    shops,
    products,
    carts,
    orders
};
