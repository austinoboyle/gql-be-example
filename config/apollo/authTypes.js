/* 
 * Different levels of authentication needed for different operations
 * Admins can do everything
 */

const Shop = require("../../models/Shop");
const _ = require("lodash");

class AuthorizationError extends Error {}

const throwError = message => {
    throw new AuthorizationError(`Permission Denied: ${message}`);
};

const requirePermission = (promise, message) => {
    return promise.then(auth => {
        // console.log(`${auth ? "HAS PERMISSION" : "DOES NOT HAVE PERMISSION"}`);
        return auth ? true : throwError(message);
    });
};

const requireAllPermissions = (promises, message) => {
    return Promise.all(promises).then(
        results => (results.every(res => res) ? true : throwError(message))
    );
};

const requireAnyPermissions = (promises, message) => {
    return Promise.all(promises).then(
        results => (results.some(res => res) ? true : throwError(message))
    );
};

/*
 * auth object shape is:
 * {
 *      username: String,
 *      access: String,
 *      _id: ObjectID
 * }
 */

const isAdmin = auth => {
    return new Promise((resolve, reject) => resolve(auth.access === "ADMIN"));
};

// Check if user exists
const isUser = auth => {
    return new Promise((resolve, reject) => resolve(auth !== null));
};

// Check if user is the account owner
const isAccountOwner = (auth, user) => {
    return isUser(auth).then(isUser => {
        if (!isUser) {
            return false;
        }
        return auth._id.toString() === user ? true : isAdmin(auth);
    });
};

// Check if user is an admin within the store
const isStoreOwner = (auth, store) => {
    return isUser(auth).then(isUser => {
        if (!isUser) {
            return false;
        }
        return Shop.findOne({
            _id: store,
            owners: auth._id.toString()
        }).then(s => (s !== null ? true : isAdmin(auth)));
    });
};

exports.AuthorizationError = AuthorizationError;
exports.isAdmin = isAdmin;
exports.isAccountOwner = isAccountOwner;
exports.isStoreOwner = isStoreOwner;
exports.isUser = isUser;
exports.requireAllPermissions = requireAllPermissions;
exports.requireAnyPermissions = requireAnyPermissions;
exports.requirePermission = requirePermission;
