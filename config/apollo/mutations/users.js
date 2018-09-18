const User = require("../../../models/User");

exports.createUser = (obj, { username }) => User.create({ username });

exports.deleteUser = (obj, { user_id }, context) =>
    User.remove({ _id: user_id });
