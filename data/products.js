const ObjectId = require("mongoose").Types.ObjectId;

module.exports = [
    {
        _id: ObjectId("311111111111111111111111"),
        name: "Toilet Paper",
        shop: ObjectId("211111111111111111111111"),
        price: 4.5
    },
    {
        _id: ObjectId("311111111111111111111112"),
        name: "Shovel",
        shop: ObjectId("211111111111111111111111"),
        price: 12.99
    },
    {
        _id: ObjectId("311111111111111111111113"),
        name: "Bananas",
        shop: ObjectId("211111111111111111111112"),
        price: 0.68
    },
    {
        _id: ObjectId("311111111111111111111114"),
        name: "Vector Cereal",
        shop: ObjectId("211111111111111111111112"),
        price: 8.99
    },
    {
        _id: ObjectId("311111111111111111111115"),
        name: "Orchid",
        shop: ObjectId("211111111111111111111113"),
        price: 14.99
    },
    {
        _id: ObjectId("311111111111111111111116"),
        name: "Flower Pot",
        shop: ObjectId("211111111111111111111113"),
        price: 7.99
    }
];
