const seedData = require("../data");
const { setup, end, graphQLQuery } = require("../config/tests/testUtils.js");
const db = require("../config/mongoose");
db();

beforeAll(setup);
afterAll(end);

describe("User Queries", () => {
    it("Returns all users with no params passed", done => {
        const query = `query {
            users{
                username
                access
                id
            }
        }`;
        graphQLQuery(query, { user: null }).then(res => {
            expect(res.data.users.length).toBe(seedData.users.length);
            done();
        });
    });
    it("Returns correct numbers of ADMINs/STOREOWNERs", done => {
        const template = access => `
        query{
            users(access: ${access}){
                id
            }
        }`;
        const q1 = template("ADMIN");
        const q2 = template("STOREOWNER");
        Promise.all([q1, q2].map(q => graphQLQuery(q))).then(
            ([admins, owners]) => {
                expect(admins.data.users.length).toBe(
                    seedData.users.filter(u => u.access === "ADMIN").length
                );
                expect(owners.data.users.length).toBe(
                    seedData.users.filter(u => u.access === "STOREOWNER").length
                );
                done();
            }
        );
    });
    it("Can be queried by username & ID", done => {
        const q1 = `query{users(id: "${seedData.users[0]._id.toHexString()}"){id}}`;
        const q2 = `query{users(username: "${
            seedData.users[0].username
        }"){id}}`;
        Promise.all([graphQLQuery(q1), graphQLQuery(q2)]).then(
            ([res1, res2]) => {
                expect(res1.data.users.length).toBe(1);
                expect(res2.data.users.length).toBe(1);
                done();
            }
        );
    });
});

describe("Order Queries", () => {
    it("Returns all orders", done => {
        const query = `query {
            orders{
                id
            }
        }`;
        graphQLQuery(query).then(res => {
            expect(res.data.orders.length).toBe(seedData.orders.length);
            done();
        });
    });
    describe("Can Be Queried By...", () => {
        it("id", done => {
            const q = `query{orders(id: "${seedData.orders[0]._id.toHexString()}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.orders.length).toBe(1);
                done();
            });
        });
        it("user_id", done => {
            const q = `query{orders(user_id: "${seedData.orders[0].user.toHexString()}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.orders.length).toBe(1);
                done();
            });
        });
        it("shop_id", done => {
            const q = `query{orders(shop_id: "${seedData.orders[0].shop.toHexString()}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.orders.length).toBe(1);
                done();
            });
        });
    });
});

describe("Product Queries", () => {
    it("Returns all products", done => {
        const query = `query {
            products{
                id
            }
        }`;
        graphQLQuery(query).then(res => {
            expect(res.data.products.length).toBe(seedData.products.length);
            done();
        });
    });
    describe("Can Be Queried By...", () => {
        it("id", done => {
            const q = `query{products(id: "${seedData.products[0]._id.toHexString()}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.products.length).toBe(1);
                done();
            });
        });
        it("name", done => {
            const q = `query{products(name: "${
                seedData.products[0].name
            }"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.products.length).toBe(1);
                done();
            });
        });
    });
});

describe("Shop Queries", () => {
    it("Returns all shops", done => {
        const query = `query {
            shops{
                id
            }
        }`;
        graphQLQuery(query).then(res => {
            expect(res.data.shops.length).toBe(seedData.shops.length);
            done();
        });
    });
    describe("Can Be Queried By...", () => {
        it("id", done => {
            const q = `query{shops(id: "${seedData.shops[0]._id.toHexString()}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.shops.length).toBe(1);
                done();
            });
        });
        it("name", done => {
            const q = `query{shops(name: "${seedData.shops[0].name}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.shops.length).toBe(1);
                done();
            });
        });
        it("product_id", done => {
            const q = `query{shops(product_id: "${seedData.products[0]._id.toHexString()}"){id}}`;
            graphQLQuery(q).then(res => {
                expect(res.data.shops.length).toBe(1);
                done();
            });
        });
    });
});
