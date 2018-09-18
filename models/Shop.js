const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const ShopModel = mongoose.model("Shop", ShopSchema);

module.exports = ShopModel;
