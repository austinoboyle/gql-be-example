const seedData = require("../data");
const {
    setup,
    end,
    graphQLQuery,
    mutation,
    query,
    user_id,
    admin_id,
    owner_ids,
    shop_ids
} = require("../config/tests/testUtils.js");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const db = require("../config/mongoose");
db();

// beforeAll(setup);
afterAll(end);

describe("Create Order", () => {
    beforeEach(setup);

    it("Denies access to non accountOwner", done => {
        const q = mutation(
            `submitOrder(user_id: ${seedData.carts[0].user}, shop_id: "${
                seedData.carts[0].shop
            }"){id total}`
        );
        User.findById(owner_ids[1]).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Does not allow submission of empty orders", done => {
        const q = mutation(
            `submitOrder(user_id: ${seedData.carts[0].user}, shop_id: "${
                seedData.carts[1].shop
            }"){id total}`
        );
        User.findById(seedData.carts[0].user).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Deletes cart and creates new order", done => {
        const q = mutation(
            `submitOrder(user_id: ${seedData.carts[0].user}, shop_id: "${
                seedData.carts[0].shop
            }"){id total}`
        );
        User.findById(seedData.carts[0].user).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.submitOrder.total).toBeDefined();
                Promise.all([Cart.find(), Order.find()]).then(
                    ([carts, orders]) => {
                        expect(carts.length).toBe(seedData.carts.length - 1);
                        expect(orders.length).toBe(seedData.orders.length + 1);
                        done();
                    }
                );
            });
        });
    });
});

describe("Return Item", () => {
    beforeEach(setup);

    it("Denies access to non accountOwner", done => {
        const q = mutation(
            `returnItem(order_id: "${seedData.orders[0].shop.toHexString()}",
                product_id: "${seedData.orders[0].items[0].product._id.toHexString()}",
                quantity: ${seedData.orders[0].items[0].quantity}){
                    id
                    items
                }`
        );
        User.findById(seedData.orders[1].user.toHexString()).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Denies invalid product id", done => {
        const q = mutation(
            `returnItem(order_id: "${seedData.orders[0].shop.toHexString()}",
                product_id: "${seedData.orders[1].items[0].product._id.toHexString()}",
                quantity: ${seedData.orders[0].items[0].quantity}){
                    id
                    items
                }`
        );
        User.findById(seedData.orders[0].user.toHexString()).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    describe("Removes Item Completely from Bill When...", () => {
        beforeEach(setup);
        const order = seedData.orders[0];
        const item = order.items[0];
        const template = quantity =>
            mutation(
                `returnItem(order_id: "${order._id.toHexString()}",
                product_id: "${item.product._id.toHexString()}"
                ${quantity !== null ? `,quantity: ${quantity}` : ""}
                ){
                    id
                    items{total}
                }`
            );

        it("Quantity > Purchased Quantity", done => {
            const q = template(item.quantity + 1);
            User.findById(order.user.toHexString()).then(owner => {
                graphQLQuery(q, { user: owner }).then(res => {
                    expect(res.data.returnItem.items.length).toBe(
                        order.items.length - 1
                    );
                    done();
                });
            });
        });
        it("Quantity === Purchased Quantity", done => {
            const q = template(item.quantity);
            User.findById(order.user.toHexString()).then(owner => {
                graphQLQuery(q, { user: owner }).then(res => {
                    expect(res.data.returnItem.items.length).toBe(
                        order.items.length - 1
                    );
                    done();
                });
            });
        });
        it("Quantity === null", done => {
            const q = template(null);
            User.findById(order.user.toHexString()).then(owner => {
                graphQLQuery(q, { user: owner }).then(res => {
                    expect(res.data.returnItem.items.length).toBe(
                        order.items.length - 1
                    );
                    done();
                });
            });
        });
    });
    it("Correctly Decreases Quantities", done => {
        const q = mutation(
            `returnItem(order_id: "${seedData.orders[0]._id.toHexString()}",
                product_id: "${seedData.orders[0].items[0].product._id.toHexString()}",
                quantity: ${seedData.orders[0].items[0].quantity - 1}){
                    id
                    items{
                        quantity
                    }
                }`
        );
        User.findById(seedData.orders[0].user.toHexString()).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.returnItem.items.length).toBe(
                    seedData.orders[0].items.length
                );
                expect(res.data.returnItem.items[0].quantity).toBe(1);
                done();
            });
        });
    });
});
