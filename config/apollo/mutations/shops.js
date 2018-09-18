const Shop = require("../../../models/Shop");
const User = require("../../../models/User");
const { isUser, isStoreOwner, requirePermission } = require("../authTypes");

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

exports.deleteShop = (obj, { shop_id }, context) => {
    return requirePermission(isStoreOwner(context.user, shop_id)).then(() =>
        Shop.remove({ _id: shop_id })
    );
};
