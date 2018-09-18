const User = require("../../../models/User");
const { isAccountOwner, requirePermission } = require("../authTypes");

exports.createUser = (obj, { username }) => User.create({ username });

exports.deleteUser = (obj, { user_id }, context) => {
    return requirePermission(isAccountOwner(context.user, user_id)).then(() =>
        User.remove({ _id: user_id })
    );
};
