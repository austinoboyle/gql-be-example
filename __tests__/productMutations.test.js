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
const Shop = require("../models/Shop");

const db = require("../config/mongoose");
db();

// beforeAll(setup);
afterAll(end);

describe("Create Product", () => {
    beforeEach(setup);

    it("Denies access to non storeOwner", done => {
        const q = mutation(
            `createProduct(name: "New Product", shop_id: "${
                shop_ids[0]
            }", price: 100){id name price}`
        );
        User.findById(owner_ids[1]).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Updates shop's products array", done => {
        const q = mutation(
            `createProduct(name: "New Product", shop_id: "${
                shop_ids[0]
            }", price: 100){id name price shop_id}`
        );
        User.findById(owner_ids[0]).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                const newProduct = res.data.createProduct;
                expect(newProduct.shop_id).toBe(shop_ids[0]);
                Shop.findById(shop_ids[0]).then(updatedShop => {
                    expect(
                        updatedShop.products.filter(
                            id => id.toString() === newProduct.id
                        ).length
                    ).toBe(1);
                    done();
                });
            });
        });
    });
    it("Allows admin", done => {
        const q = mutation(
            `createProduct(name: "New Product", shop_id: "${
                shop_ids[0]
            }", price: 100){id name price}`
        );
        User.findById(admin_id).then(admin => {
            graphQLQuery(q, { user: admin }).then(res => {
                expect(res.data.createProduct.id).toBeDefined();
                done();
            });
        });
    });
});

describe("Update Product", () => {
    beforeEach(setup);

    it("Denies access to non storeOwner", done => {
        const q = mutation(
            `updateProduct(shop_id: "${
                shop_ids[0]
            }", product_id: "${seedData.shops[0].products[0].toHexString()}" 
            name: "New Product"){id name price}`
        );
        User.findById(owner_ids[1]).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Updates name and price", done => {
        const newName = "New Name",
            newPrice = 11111;
        const q = mutation(
            `updateProduct(shop_id: "${
                shop_ids[0]
            }", product_id: "${seedData.shops[0].products[0].toHexString()}" 
            name: "${newName}", price: ${newPrice}){id name price}`
        );
        User.findById(owner_ids[0]).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                const newProduct = res.data.updateProduct;
                expect(newProduct.name).toBe(newName);
                expect(newProduct.price).toBe(newPrice);
                done();
            });
        });
    });
    it("Allows admin", done => {
        const newName = "New Name",
            newPrice = 11111;
        const q = mutation(
            `updateProduct(shop_id: "${
                shop_ids[0]
            }", product_id: "${seedData.shops[0].products[0].toHexString()}" 
            name: "${newName}", price: ${newPrice}){id name price}`
        );
        User.findById(admin_id).then(admin => {
            graphQLQuery(q, { user: admin }).then(res => {
                expect(res.data.updateProduct.id).toBeDefined();
                done();
            });
        });
    });
});

describe("Delete Product", () => {
    beforeEach(setup);

    it("Denies access to non storeOwner", done => {
        const q = mutation(
            `deleteProduct(shop_id: "${shop_ids[0]}", 
                product_id: "${seedData.shops[0].products[0].toHexString()}"){
                    n ok
                }`
        );
        User.findById(owner_ids[1]).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Updates shop's products list", done => {
        const q = mutation(
            `deleteProduct(shop_id: "${shop_ids[0]}", 
                product_id: "${seedData.shops[0].products[0].toHexString()}"){
                    n ok
                }`
        );
        User.findById(owner_ids[0]).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.deleteProduct.n).toBe(1);
                Shop.findById(shop_ids[0]).then(updatedShop => {
                    expect(updatedShop.products.length).toBe(
                        seedData.shops[0].products.length - 1
                    );
                    done();
                });
            });
        });
    });
    it("Allows admin", done => {
        const q = mutation(
            `deleteProduct(shop_id: "${shop_ids[0]}", 
                product_id: "${seedData.shops[0].products[0].toHexString()}"){
                    n ok
                }`
        );
        User.findById(admin_id).then(admin => {
            graphQLQuery(q, { user: admin }).then(res => {
                expect(res.data.deleteProduct.n).toBe(1);
                done();
            });
        });
    });
});
