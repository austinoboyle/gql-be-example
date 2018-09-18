const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");
const Shop = require("./models/Shop");
const Cart = require("./models/Cart");
const data = require("./data");
const mongoose = require("mongoose");

module.exports = (req, res) => {
    const products = [];
    const shops = [];
    const users = [];
    Promise.all([
        Order.remove(),
        User.remove(),
        Product.remove(),
        Shop.remove(),
        Cart.remove()
    ])
        .then(result => {
            console.log("REMOVED ALL DOCS");
            return Promise.all(
                data.users
                    .map(u => User.create(u).then(u => users.push(u)))
                    .concat(
                        data.shops.map(s =>
                            Shop.create(s).then(s => shops.push(s))
                        )
                    )
            );
        })
        .then(result => {
            console.log("CREATED USERS AND SHOPS");
            return Promise.all(
                data.products.map((p, i) => {
                    const shop_id = shops[i % shops.length]._id;
                    return Product.create(
                        Object.assign(p, { shop: shop_id })
                    ).then(p => {
                        products.push(p);
                        return Shop.findByIdAndUpdate(shop_id, {
                            $push: { products: p._id }
                        });
                    });
                })
            );
        })
        .then(result => {
            console.log("CREATED PRODUCTS AND ADDED TO SHOPS");
            return Order.create({
                shop: shops[0]._id,
                user: users[0]._id,
                items: [{ product: products[0], quantity: 1 }]
            });
        })
        .then(result => {
            console.log("CREATED ORDER");
            return Promise.all(
                shops.map((s, i) =>
                    User.create({
                        username: `owner${i}`,
                        access: "STOREOWNER"
                    }).then(u =>
                        Shop.findByIdAndUpdate(s._id, {
                            $push: { owners: u._id }
                        })
                    )
                )
            );
        })
        .then(result => {
            console.log("CREATED OWNERS FOR EACH STORE");
            res.send("SUCCESS");
        })
        .catch(e => console.log(e));
};
