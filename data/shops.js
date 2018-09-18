const ObjectId = require("mongoose").Types.ObjectId;

module.exports = [
    {
        _id: ObjectId("211111111111111111111111"),
        name: "Shop #1",
        products: [
            ObjectId("311111111111111111111111"),
            ObjectId("311111111111111111111112")
        ],
        owners: [ObjectId("111111111111111111111114")]
    },
    {
        _id: ObjectId("211111111111111111111112"),
        name: "Shop #2",
        products: [
            ObjectId("311111111111111111111113"),
            ObjectId("311111111111111111111114")
        ],
        owners: [ObjectId("111111111111111111111115")]
    },
    {
        _id: ObjectId("211111111111111111111113"),
        name: "Shop #3",
        products: [
            ObjectId("311111111111111111111115"),
            ObjectId("311111111111111111111116")
        ],
        owners: [ObjectId("111111111111111111111116")]
    }
];
