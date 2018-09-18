const {
    setup,
    end,
    user_id,
    admin_id,
    owner_ids,
    shop_ids
} = require("../config/tests/testUtils.js");

const {
    isUser,
    isAdmin,
    isAccountOwner,
    isStoreOwner,
    requirePermission,
    requireAnyPermissions,
    requireAllPermissions,
    AuthorizationError
} = require("../config/apollo/authTypes");

const User = require("../models/User");

const db = require("../config/mongoose");
db();
beforeAll(setup);
afterAll(end);

describe("ADMIN", () => {
    let admin;
    beforeAll(done =>
        User.findById(admin_id).then(u => {
            admin = u;
            done();
        }));
    it("Is Always Accepted", done => {
        const validateAdmin = isAdmin(admin);
        const validateUser = isUser(admin);
        const validateAccountOwner = requirePermission(
            isAccountOwner(admin, user_id)
        );
        const validateStoreOwner = requirePermission(
            isStoreOwner(admin, shop_ids[0])
        );
        Promise.all([
            validateAdmin,
            validateUser,
            validateAccountOwner,
            validateStoreOwner
        ])
            .then(responses => {
                expect(responses.every(x => x)).toBe(true);
                done();
            })
            .catch(e => console.log(e));
    });
});

describe("isUser", () => {
    it("False for null User", done => {
        isUser(null).then(res => {
            expect(res).toBe(false);
            done();
        });
    });
    it("Accepts User", done => {
        User.findById(user_id).then(u => {
            isUser(u).then(res => {
                expect(res).toBe(true);
                done();
            });
        });
    });
});

describe("isAccountOwner", () => {
    it("Denies null", done => {
        isAccountOwner(null, user_id).then(res => {
            expect(res).toBe(false);
            done();
        });
    });
    it("Denies non account owner", done => {
        User.findById(user_id).then(u => {
            isAccountOwner(u, owner_ids[0]).then(res => {
                expect(res).toBe(false);
                done();
            });
        });
    });
    it("Accepts Account Owner", done => {
        User.findById(user_id).then(u => {
            isAccountOwner(u, u._id.toString()).then(res => {
                expect(res).toBe(true);
                done();
            });
        });
    });
});

describe("isAccountOwner", () => {
    it("Denies null", done => {
        isStoreOwner(null, shop_ids[1]).then(res => {
            expect(res).toBe(false);
            done();
        });
    });
    it("Denies owner of other shop", done => {
        User.findById(owner_ids[0]).then(u => {
            isAccountOwner(u, shop_ids[1]).then(res => {
                expect(res).toBe(false);
                done();
            });
        });
    });
    it("Accepts Store Owner", done => {
        User.findById(owner_ids[0]).then(u => {
            isStoreOwner(u, shop_ids[0]).then(res => {
                expect(res).toBe(true);
                done();
            });
        });
    });
});

describe("requirePermission", () => {
    it("Rejects false", done => {
        requirePermission(Promise.resolve(false)).catch(e => {
            expect(e instanceof AuthorizationError).toBe(true);
            done();
        });
    });
    it("Resolves true", done => {
        requirePermission(Promise.resolve(true)).then(res => {
            expect(res).toBe(true);
            done();
        });
    });
});

describe("anyPermissions", () => {
    it("Resolves for 1 true 1 false", done => {
        requireAnyPermissions([true, false]).then(res => {
            expect(res).toBe(true);
            done();
        });
    });
    it("Rejects for 1 false", done => {
        requireAnyPermissions([false])
            .then(_ => {
                console.log("SHOULD NOT GO HERE");
                expect(false).toBe(true);
                done();
            })
            .catch(e => {
                expect(e instanceof AuthorizationError).toBe(true);
                done();
            });
    });
});

describe("allPermissions", () => {
    it("Rejects for 1 true 1 false", done => {
        requireAllPermissions([true, false])
            .then(_ => {
                console.log("SHOULD NOT GO HERE");
                expect(false).toBe(true);
                done();
            })
            .catch(e => {
                expect(e instanceof AuthorizationError).toBe(true);
                done();
            });
    });
    it("Resolves for 1 true", done => {
        requireAllPermissions([true])
            .then(res => {
                expect(res).toBe(true);
                done();
            })
            .catch(_ => {
                expect(true).toBe(false);
                done();
            });
    });
});
