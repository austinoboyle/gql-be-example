/** @module mutations-products */

const Product = require("../../../models/Product");
const Shop = require("../../../models/Shop");
const { isStoreOwner, requirePermission } = require("../authTypes");
const { createQuery } = require("../../../utils");

/**
 * Create a new Product.  Adds product to Shop.producs array.
 *
 * @param {*} obj unused
 * @param {Object} product { name:String, price:Number, shop_id:String }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolve to new Product
 */
exports.createProduct = (obj, { name, price, shop_id }, context) => {
    return requirePermission(isStoreOwner(context.user, shop_id)).then(() =>
        Product.create({
            name,
            price,
            shop: shop_id
        }).then(newProduct => {
            return Shop.findOneAndUpdate(
                { _id: shop_id },
                { $push: { products: newProduct._id.toString() } }
            ).then(() => newProduct);
        })
    );
};

/**
 * Update Existing Product
 *
 * @param {*} obj unused
 * @param {Object} product { shop_id:String, product_id:String, name:String, price:Number }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to updated Product
 */
exports.updateProduct = (
    obj,
    { shop_id, product_id, name, price },
    context
) => {
    return requirePermission(isStoreOwner(context.user, shop_id)).then(() =>
        Product.findOneAndUpdate(
            { _id: product_id, shop: shop_id },
            createQuery({ name, price }),
            { new: true }
        )
            .exec()
            .then(updated => {
                if (updated === null) {
                    throw new Error("Product does not exist");
                }
                return updated;
            })
    );
};

/**
 * Remove a product.  Deletes product item and removes item Shop.products of
 * shop it belongs to.
 *
 * @param {*} obj unused
 * @param {Object} product { shop_id:String, product_id:String, name:String, price:Number }
 * @param {Object} context {user: Object}
 * @returns {Promise} resolves to {n:Int, ok:Int}
 */
exports.deleteProduct = (obj, { shop_id, product_id }, context) => {
    return requirePermission(isStoreOwner(context.user, shop_id))
        .then(() =>
            Shop.findByIdAndUpdate(shop_id, { $pull: { products: product_id } })
        )
        .then(() => Product.remove({ _id: product_id, shop: shop_id }));
};
