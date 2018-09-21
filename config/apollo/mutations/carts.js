/** @module mutations-carts */

const Cart = require("../../../models/Cart");
const Shop = require("../../../models/Shop");
const User = require("../../../models/User");
const { populateTotals } = require("../../../utils");
const { isAccountOwner, requirePermission } = require("../authTypes");

/**
 * Add an item to a cart
 *
 * @param {*} obj unused
 * @param {Object} item { user_id: modify this user's cart, shop_id: add item from
 * this store, product_id: id of product to add, quantity: number of said item }
 * @param {Object} context {user: user making request}
 * @returns {Promise} resolves to updated cart
 */
exports.addToCart = (
    obj,
    { user_id, shop_id, product_id, quantity },
    context
) => {
    return requirePermission(isAccountOwner(context.user, user_id)).then(() => {
        return Promise.all([
            Shop.count({ _id: shop_id, products: product_id }),
            User.count({ _id: user_id })
        ])
            .then(([shopCount, userCount]) => {
                if (shopCount === 0) {
                    return new Error(
                        `Shop ${shop_id} either does not exist or does not have that Product.`
                    );
                } else if (userCount === 0) {
                    return new Error(`User ${user_id} does not exist`);
                } else {
                    return Cart.count({
                        user: user_id,
                        shop: shop_id,
                        "items.product": product_id
                    }).then(count => count !== 0);
                }
            })
            .then(alreadyHasItem => {
                if (alreadyHasItem) {
                    // User has item in their cart already, update the quantity
                    return Cart.findOne({
                        user: user_id,
                        shop: shop_id,
                        "items.product": product_id
                    }).then(c => {
                        const current_quantity = c.items.filter(
                            i => i.product.toString() === product_id
                        )[0].quantity;
                        return Cart.findOneAndUpdate(
                            { _id: c._id, "items.product": product_id },
                            {
                                $set: {
                                    "items.$.quantity":
                                        current_quantity + quantity
                                }
                            },
                            { new: true }
                        )
                            .populate("items.product")
                            .then(c => populateTotals(c));
                    });
                } else {
                    // User does not have that item in their cart at that store,
                    // push new LineItem to the cart.
                    return Cart.findOneAndUpdate(
                        { user: user_id, shop: shop_id },
                        {
                            $push: {
                                items: { product: product_id, quantity }
                            }
                        },
                        { upsert: true, new: true }
                    )
                        .populate("items.product")
                        .exec()
                        .then(o => populateTotals(o));
                }
            });
    });
};

/**
 * Update quantity of specific item in cart
 *
 * @param {*} obj unused
 * @param {Object} item { user_id: modify this user's cart, shop_id: add item from
 * this store, product_id: id of product to add, quantity: change quantity to... }
 * @param {Object} context {user: user making request}
 * @returns {Promise} resolves to updated cart
 */
exports.updateItemQuantity = (
    obj,
    { user_id, shop_id, product_id, quantity },
    context
) => {
    return requirePermission(isAccountOwner(context.user, user_id)).then(() => {
        if (quantity <= 0) {
            return Cart.findOneAndUpdate(
                { user: user_id, shop: shop_id },
                {
                    $pull: { items: { product: product_id } }
                },
                { new: true }
            )
                .populate("items.product")
                .exec()
                .then(c => populateTotals(c));
        } else {
            return Cart.findOneAndUpdate(
                {
                    user: user_id,
                    shop: shop_id,
                    "items.product": product_id
                },
                { $set: { "items.$.quantity": quantity } },
                { new: true }
            )
                .populate("items.product")
                .exec()
                .then(c => populateTotals(c));
        }
    });
};
