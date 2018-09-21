/**
 * Auth Types Module
 * @module authTypes
 */

const Shop = require("../../models/Shop");
const _ = require("lodash");

/**
 * Custom Error class for Authorization
 *
 * @class AuthorizationError
 * @extends {Error}
 */
class AuthorizationError extends Error {}

/**
 * Throw AuthorizationError with message
 *
 * @throws {AuthorizationError}
 * @param {String} message
 */
const throwError = message => {
    throw new AuthorizationError(
        `Permission Denied: ${message ? message : "Don't have required access"}`
    );
};

/**
 * Require a user to have a certain permission
 *
 * @param {Promise} promise resolves to boolean
 * @param {String} message message to pass to throwError call
 * @throws {AuthorizationError}
 * @returns {Promise} resolves true if user has access
 */
const requirePermission = (promise, message) => {
    return promise.then(auth => {
        // console.log(`${auth ? "HAS PERMISSION" : "DOES NOT HAVE PERMISSION"}`);
        return auth ? true : throwError(message);
    });
};

/**
 * Require a user to have ALL of a list of permissions.  Throw
 * AuthorizationError if any requirement not met.
 *
 * @param {Array<Promise>} promises Array of required permission
 * @param {String} message message to pass to throwError call on fail
 * @throws {AuthorizationError}
 * @returns {Promise} true if all promises resolve to true
 */
const requireAllPermissions = (promises, message) => {
    return Promise.all(promises).then(
        results => (results.every(res => res) ? true : throwError(message))
    );
};

/**
 * Require ANY 1 of a list of permissions.  Throw AuthorizationError if access
 * level not met
 *
 * @param {Array<Promise>} promises
 * @param {String} message
 * @throws {AuthorizationError}
 * @returns {Promise} true if any permission resolves to true
 */
const requireAnyPermissions = (promises, message) => {
    return Promise.all(promises).then(
        results => (results.some(res => res) ? true : throwError(message))
    );
};

/**
 * Check if auth'd user is an admin
 *
 * @param {User} auth
 * @returns {Promise} true if user is admin, false otherwise
 */
const isAdmin = auth => {
    return new Promise((resolve, reject) => resolve(auth.access === "ADMIN"));
};

/**
 * Check if a user is authenticated
 *
 * @param {User} auth
 * @returns {Promise}
 */
const isUser = auth => {
    return new Promise((resolve, reject) => resolve(auth !== null));
};

/**
 * Check if auth'd user has access to modify the account they are attempting to
 *
 * @param {User} auth
 * @param {String} user Mongo _id of user being modified
 * @returns {Promise}
 */
const isAccountOwner = (auth, user) => {
    return isUser(auth).then(isUser => {
        if (!isUser) {
            return false;
        }
        return auth._id.toString() === user ? true : isAdmin(auth);
    });
};

/**
 * Check if auth'd user has ability to modify specified store
 *
 * @param {User} auth auth'd user
 * @param {String} store Mongo _id of store being edited
 * @returns {Promise}
 */
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
