/** @module mutations-users */
const User = require("../../../models/User");
const { isAccountOwner, requirePermission } = require("../authTypes");

/**
 * Create a new user
 *
 * @param {*} obj unused
 * @param {Object} user { username:String }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to new user
 */
exports.createUser = (obj, { username }) => User.create({ username });

/**
 * delete a user by id
 *
 * @param {*} obj unused
 * @param {Object} user { user_id:String }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to deletion object {n:Int, ok:Int}
 */
exports.deleteUser = (obj, { user_id }, context) => {
    return requirePermission(isAccountOwner(context.user, user_id)).then(() =>
        User.remove({ _id: user_id })
    );
};
