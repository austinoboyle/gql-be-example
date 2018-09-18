const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = require("./Product").schema;

const OrderSchema = new mongoose.Schema({
    shop: {
        type: Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    items: [
        {
            product: ProductSchema,
            quantity: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

OrderSchema.pre("validate", function(next) {
    this.items = this.items.map(i =>
        Object.assign(i, { total: (i.product.price * i.quantity).toFixed(2) })
    );
    this.total = this.items
        .reduce((prev, curr) => prev + curr.total, 0)
        .toFixed(2);
    next();
});

OrderSchema.virtual("shop_id").get(function() {
    return this.shop.toString();
});

OrderSchema.virtual("user_id").get(function() {
    return this.user.toString();
});

OrderSchema.pre("save", function(next) {
    this.items = this.items.map(i =>
        Object.assign(i, { total: i.product.price * i.quantity })
    );
    this.total = this.items.reduce((prev, curr) => prev + curr.total, 0);
    next();
});

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;
