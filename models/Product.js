const mongoose = require("mongoose");
const Schema = mongoose.Schema;

ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    }
});

ProductSchema.virtual("shop_id").get(function() {
    return this.shop.toString();
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
