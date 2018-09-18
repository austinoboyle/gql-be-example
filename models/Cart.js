const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

CartSchema.virtual("user_id").get(function() {
    return this.user.toString();
});

CartSchema.virtual("shop_id").get(function() {
    return this.shop.toString();
});

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
