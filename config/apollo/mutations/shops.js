const Shop = require("../../../models/Shop");
const User = require("../../../models/User");

exports.createShop = (obj, { name }, context) => {
    return Shop.create({
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
        });
};

exports.deleteShop = (obj, { shop_id }, context) =>
    Shop.remove({ _id: shop_id });
