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
const resetDb = require("../resetDb");
const User = require("../models/User");
const db = require("../config/mongoose");
db();

// beforeAll(setup);
afterAll(end);

describe("Create Shop", () => {
    beforeEach(setup);

    it("Denies access to null user", done => {
        const q = mutation(
            `createShop(name: "My Test Shop"){id name owners{id}}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
    it("Allows access to basic user, makes them STOREOWNER", done => {
        const q = mutation(`createShop(name: "My Test Shop"){id owners{id}}`);
        User.findById(user_id).then(basicUser => {
            graphQLQuery(q, { user: basicUser }).then(res => {
                expect(basicUser.access).toBe("USER");
                expect(res.data.createShop.owners[0].id).toBeDefined();
                User.findById(user_id).then(newStoreOwner => {
                    expect(newStoreOwner.access).toBe("STOREOWNER");
                    done();
                });
            });
        });
    });
    it("Keeps users' admin status when they create shop", done => {
        const q = mutation(`createShop(name: "My Test Shop"){id owners{id}}`);
        User.findById(admin_id).then(adminUser => {
            graphQLQuery(q, { user: adminUser }).then(res => {
                expect(res.data.createShop.owners[0].id).toBeDefined();
                User.findById(admin_id).then(u => {
                    expect(u.access).toBe("ADMIN");
                    done();
                });
            });
        });
    });
});

describe("Delete Shop", () => {
    beforeEach(setup);
    it("Rejects non-admin, non-store owners", done => {
        const q = mutation(`deleteShop(shop_id: "${shop_ids[0]}"){n ok}`);
        User.findById(owner_ids[1]).then(nonOwner => {
            graphQLQuery(q, { user: nonOwner }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Allows store owner", done => {
        const q = mutation(`deleteShop(shop_id: "${shop_ids[0]}"){n ok}`);
        User.findById(owner_ids[0]).then(owner => {
            graphQLQuery(q, { user: owner }).then(res => {
                expect(res.data.deleteShop.n).toBe(1);
                done();
            });
        });
    });
    it("Allows admin", done => {
        const q = mutation(`deleteShop(shop_id: "${shop_ids[0]}"){n ok}`);
        User.findById(admin_id).then(admin => {
            graphQLQuery(q, { user: admin }).then(res => {
                expect(res.data.deleteShop.n).toBe(1);
                done();
            });
        });
    });
});
