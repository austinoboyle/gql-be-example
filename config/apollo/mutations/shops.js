/** @module mutations-shops */

const Shop = require("../../../models/Shop");
const User = require("../../../models/User");
const { isUser, isStoreOwner, requirePermission } = require("../authTypes");

/**
 * Create a new Shop.  Makes creator a STOREOWNER if not already.
 *
 * @param {*} obj unused
 * @param {*} shop { name:String }
 * @param {*} context {user: Object}
 * @returns {Promise} resolves to new Shop
 */
exports.createShop = (obj, { name }, context) => {
    return requirePermission(isUser(context.user)).then(() =>
        Shop.create({
            name,
            owners: [context.user._id.toString()]
        })
            .then(newShop => {
                return Shop.populate(newShop, [
                    {
                        path: "owners"
                    }
                ]);
            })
            .then(populatedShop => {
                if (context.user.access === "USER") {
                    return User.findByIdAndUpdate(context.user._id.toString(), {
                        access: "STOREOWNER"
                    }).then(() => populatedShop);
                } else {
                    return populatedShop;
                }
            })
    );
};

/**
 * Delete existing shop.  Make user a USER if they are not an admin and don't
 * own any other stores.
 *
 * @param {*} obj unused
 * @param {*} shop { shop_id:String }
 * @param {*} context {user: Object}
 * @returns {Promise} resolves to MongoDB Deletion Object {n:Int, ok:Int}
 */
exports.deleteShop = (obj, { shop_id }, context) => {
    return requirePermission(isStoreOwner(context.user, shop_id)).then(() => {
        return Shop.remove({ _id: shop_id }).then(deleted => {
            if (context.user.access === "ADMIN") {
                return deleted;
            } else {
                return Shop.count({ owners: context.user._id.toString() }).then(
                    numShops => {
                        if (numShops === 0) {
                            return User.findByIdAndUpdate(context.user._id, {
                                access: "USER"
                            }).then(newUser => deleted);
                        } else {
                            return deleted;
                        }
                    }
                );
            }
        });
    });
};
