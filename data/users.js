const ObjectId = require("mongoose").Types.ObjectId;

module.exports = [
    {
        username: "austinoboyle",
        access: "ADMIN",
        _id: ObjectId("111111111111111111111111")
    },
    {
        username: "user1",
        access: "USER",
        _id: ObjectId("111111111111111111111112")
    },
    {
        username: "user2",
        access: "USER",
        _id: ObjectId("111111111111111111111113")
    },
    {
        username: "owner1",
        access: "STOREOWNER",
        _id: ObjectId("111111111111111111111114")
    },
    {
        username: "owner2",
        access: "STOREOWNER",
        _id: ObjectId("111111111111111111111115")
    },
    {
        username: "owner3",
        access: "STOREOWNER",
        _id: ObjectId("111111111111111111111116")
    }
];
