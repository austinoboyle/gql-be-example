/** @module mutations-orders */

const Order = require("../../../models/Order");
const Cart = require("../../../models/Cart");
const { requirePermission, isAccountOwner } = require("../authTypes");
const _ = require("lodash");

/**
 * Resolver to submit an order
 *
 * @param {*} obj
 * @param {Object} cart { user_id: id of user submitting order, shop_id: id of shop their
 * order is at }
 * @param {Object} context contains user that sent the request
 * @returns {Promise} resolves to the created Order
 */
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

/**
 * Resolver to return an item, modifying an existing order.
 *
 * @param {*} obj
 * @param {Object} order { order_id: id of order, product_id: id of product being
 * returned, quantity: number of item to return }
 * @param {Object} context {user: user who sent the request}
 * @returns {Promise} resolves to updated Order
 */
exports.returnItem = (obj, { order_id, product_id, quantity }, context) => {
    return Order.findById(order_id)
        .then(o => {
            return requirePermission(
                isAccountOwner(context.user, o.user.toString())
            ).then(() => o);
        })
        .then(o => {
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
