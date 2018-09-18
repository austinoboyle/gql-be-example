const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Shop = require("./models/Shop");
const Cart = require("./models/Cart");
const data = require("./data");

module.exports = () => {
    return Promise.all([
        Order.remove(),
        User.remove(),
        Product.remove(),
        Shop.remove(),
        Cart.remove()
    ])
        .then(result => User.insertMany(data.users))
        .then(users => Product.insertMany(data.products))
        .then(products => Shop.insertMany(data.shops))
        .then(shops => Order.insertMany(data.orders))
        .then(orders => Cart.insertMany(data.carts))
        .then(carts => {
            return data;
        })
        .catch(e => console.log(e));
};
