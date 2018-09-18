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

afterAll(end);

describe("Add Item", () => {
    beforeEach(setup);

    it("Denies access to non accountOwner", done => {
        const q = mutation(
            `addToCart(user_id: ${seedData.carts[0].user}, shop_id: "${
                seedData.carts[0].shop
            }", product_id: ${seedData.shops[0].products[0].toHexString()}){id total}`
        );
        User.findById(owner_ids[0]).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Does not allow addition of invalid item", done => {
        const q = mutation(
            `addToCart(user_id: ${seedData.carts[0].user.toHexString()}, 
                shop_id: "${seedData.carts[0].shop}", 
                product_id: ${seedData.shops[1].products[0].toHexString()})
                    {
                        id total
                    }`
        );
        User.findById(seedData.carts[0].user.toHexString()).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Defaults to quantity 1", done => {
        const q = mutation(
            `addToCart(user_id: ${owner_ids[0]}, 
                shop_id: "${shop_ids[0]}",
                product_id: ${seedData.shops[0].products[0].toHexString()})
                    {
                        items{quantity}
                    }`
        );
        User.findById(owner_ids[0]).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.addToCart.items[0].quantity).toBe(1);
                done();
            });
        });
    });
    it("Creates Cart if it doesn't already exist", done => {
        const q = mutation(
            `addToCart(user_id: ${owner_ids[0]}, 
                shop_id: "${shop_ids[0]}",
                product_id: ${seedData.shops[0].products[0].toHexString()})
                    {
                        items{quantity}
                    }`
        );
        User.findById(owner_ids[0]).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.addToCart.items[0].quantity).toBe(1);
                Cart.find().then(carts => {
                    expect(carts.length).toBe(seedData.carts.length + 1);
                    done();
                });
            });
        });
    });
    it("Updates quantity if item exists in cart", done => {
        const add_quantity = 2;
        const q = mutation(
            `addToCart(user_id: ${seedData.carts[0].user.toHexString()}, 
                shop_id: "${seedData.carts[0].shop.toHexString()}",
                product_id: ${seedData.carts[0].items[0].product.toHexString()},
                quantity: ${add_quantity}
            )
                    {
                        items{quantity}
                    }`
        );
        User.findById(seedData.carts[0].user).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.addToCart.items[0].quantity).toBe(
                    seedData.carts[0].items[0].quantity + add_quantity
                );
                done();
            });
        });
    });
    it("Pushes item if not already in cart", done => {
        const q = mutation(
            `addToCart(user_id: ${seedData.carts[0].user.toHexString()}, 
                shop_id: "${seedData.carts[0].shop.toHexString()}",
                product_id: ${seedData.shops[0].products[1].toHexString()}
            )
                    {
                        items{quantity}
                    }`
        );
        User.findById(seedData.carts[0].user).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.addToCart.items.length).toBe(
                    seedData.carts[0].items.length + 1
                );
                done();
            });
        });
    });
});

describe("Update Quantity", () => {
    beforeEach(setup);

    it("Denies access to non accountOwner", done => {
        const new_quantity = 100;
        const q = mutation(
            `updateItemQuantity(
                user_id: "${seedData.carts[0].user.toHexString()}",
                shop_id: "${seedData.carts[0].shop.toHexString()}",
                product_id: "${seedData.carts[0].items[0].product._id.toHexString()}",
                quantity: ${new_quantity}){
                    items {quantity}
                }`
        );
        User.findById(owner_ids[0]).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Denies invalid product id", done => {
        const new_quantity = 100;
        const q = mutation(
            `updateItemQuantity(
                user_id: "${seedData.carts[0].user.toHexString()}",
                shop_id: "${seedData.carts[0].shop.toHexString()}",
                product_id: "${seedData.carts[1].items[0].product._id.toHexString()}",
                quantity: ${new_quantity}){
                    items {quantity}
                }`
        );
        User.findById(seedData.carts[0].user).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Properly Updates Quantity", done => {
        const new_quantity = 100;
        const q = mutation(
            `updateItemQuantity(
                user_id: "${seedData.carts[0].user.toHexString()}",
                shop_id: "${seedData.carts[0].shop.toHexString()}",
                product_id: "${seedData.carts[0].items[0].product._id.toHexString()}",
                quantity: ${new_quantity}){
                    items {quantity}
                }`
        );
        User.findById(seedData.carts[0].user).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.updateItemQuantity.items[0].quantity).toBe(
                    new_quantity
                );
                done();
            });
        });
    });
    describe("Removes Item Completely When...", () => {
        beforeEach(setup);
        it("Quantity < 0", done => {
            const new_quantity = -1;
            const q = mutation(
                `updateItemQuantity(
                    user_id: "${seedData.carts[0].user.toHexString()}",
                    shop_id: "${seedData.carts[0].shop.toHexString()}",
                    product_id: "${seedData.carts[0].items[0].product._id.toHexString()}",
                    quantity: ${new_quantity}){
                        items {quantity}
                    }`
            );
            User.findById(seedData.carts[0].user).then(owner => {
                graphQLQuery(q, { user: owner }).then(res => {
                    expect(res.data.updateItemQuantity.items.length).toBe(
                        seedData.carts[0].items.length - 1
                    );
                    done();
                });
            });
        });
        it("Quantity === 0", done => {
            const new_quantity = 0;
            const q = mutation(
                `updateItemQuantity(
                    user_id: "${seedData.carts[0].user.toHexString()}",
                    shop_id: "${seedData.carts[0].shop.toHexString()}",
                    product_id: "${seedData.carts[0].items[0].product._id.toHexString()}",
                    quantity: ${new_quantity}){
                        items {quantity}
                    }`
            );
            User.findById(seedData.carts[0].user).then(owner => {
                graphQLQuery(q, { user: owner }).then(res => {
                    expect(res.data.updateItemQuantity.items.length).toBe(
                        seedData.carts[0].items.length - 1
                    );
                    done();
                });
            });
        });
    });
});
