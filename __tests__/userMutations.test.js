const seedData = require("../data");
const {
    setup,
    end,
    graphQLQuery,
    mutation,
    query,
    user_id,
    admin_id
} = require("../config/tests/testUtils.js");
const resetDb = require("../resetDb");
const User = require("../models/User");
const db = require("../config/mongoose");
db();
// beforeAll(setup);
afterAll(end);

describe("Create User", () => {
    beforeEach(setup);

    it("Defaults to USER access", done => {
        const q = mutation(
            `createUser(username: "testUser"){id username access}`
        );
        graphQLQuery(q).then(res => {
            expect(res.data.createUser.access).toBe("USER");
            done();
        });
    });
    it("Rejects Duplicate Usernames", done => {
        const q = mutation(
            `createUser(username: "${
                seedData.users[0].username
            }"){id username access}`
        );
        graphQLQuery(q).then(res => {
            expect(res.errors).toBeDefined();
            done();
        });
    });
});

describe("Delete User", () => {
    beforeEach(setup);
    it("Rejects non-admin, non-account owners", done => {
        const q = mutation(`deleteUser(user_id: "${admin_id}"){n ok}`);
        User.findById(user_id).then(basicUser => {
            graphQLQuery(q, { user: basicUser }).then(res => {
                expect(res.errors).toBeDefined();
                done();
            });
        });
    });
    it("Allows account owner", done => {
        const q = mutation(`deleteUser(user_id: "${user_id}"){n ok}`);
        User.findById(user_id).then(accountOwner => {
            graphQLQuery(q, { user: accountOwner }).then(res => {
                expect(res.data.deleteUser.n).toBe(1);
                done();
            });
        });
    });
    it("Allows admin", done => {
        const q = mutation(
            `deleteUser(user_id: "111111111111111111111112"){n ok}`
        );
        User.findById("111111111111111111111111").then(adminUser => {
            graphQLQuery(q, { user: adminUser }).then(res => {
                expect(res.data.deleteUser.n).toBe(1);
                done();
            });
        });
    });
});
