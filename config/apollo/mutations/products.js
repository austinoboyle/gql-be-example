const Product = require("../../../models/Product");
const Shop = require("../../../models/Shop");
const { createQuery } = require("../../../utils");

exports.createProduct = (obj, { name, price, shop_id }, context) => {
    return Product.create({
        name,
        price,
        shop: shop_id
    }).then(newProduct => {
        return Shop.findOneAndUpdate(
            { _id: shop_id },
            { $push: { products: newProduct._id.toString() } }
        ).then(() => newProduct);
    });
};

exports.updateProduct = (
    obj,
    { shop_id, product_id, name, price },
    context
) => {
    return Product.findOneAndUpdate(
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
        });
};

exports.deleteProduct = (obj, { shop_id, product_id }, context) =>
    Product.remove({ _id: product_id, shop: shop_id });