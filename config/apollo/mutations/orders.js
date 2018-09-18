const Order = require("../../../models/Order");
const Cart = require("../../../models/Cart");
const { requirePermission, isAccountOwner } = require("../authTypes");
const _ = require("lodash");

exports.submitOrder = (obj, { user_id, shop_id }, context) => {
    return requirePermission(isAccountOwner(context.user, user_id)).then(() =>
        Cart.findOne({ user: user_id, shop: shop_id })
            .populate("items.product")
            .exec()
            .then(c => {
                if (c === null) {
                    throw new Error("Could not find cart");
                }
                const newOrder = _.pick(c, ["user", "shop", "items"]);
                return Promise.all([
                    Cart.remove({ _id: c._id.toString() }),
                    Order.create(newOrder)
                ]);
            })
            .then(([removed, order]) => order)
    );
};

// TODO - Implementation
exports.returnItem = (obj, { order_id, product_id, quantity }, context) => {
    return Order.findById(order_id)
        .then(o => {
            return requirePermission(
                isAccountOwner(context.user, o.user.toString())
            ).then(() => o);
        })
        .then(o => {
            console.log("ORDER", o);
            const itemIndex = o.items.findIndex(
                i => i.product._id.toString() === product_id
            );
            if (itemIndex === -1) {
                return new Error("Cannot return item not on bill");
            }
            if (
                quantity === null ||
                quantity === undefined ||
                o.items[itemIndex].quantity <= quantity
            ) {
                o.items.splice(itemIndex, 1);
                return o.save();
            } else {
                o.items[itemIndex].quantity -= quantity;
                return o.save();
            }
        });
};
