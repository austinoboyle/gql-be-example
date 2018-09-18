const _ = require("lodash");

exports.populateTotals = order => {
    if (_.isEmpty(order)) {
        return new Error("Cart/Order does not exist");
    }
    console.log("POPULATING TOTALS FOR", order);
    order.items = order.items.map(i => {
        i.total = i.product.price * i.quantity;
        return i;
    });
    order.total = order.items.reduce((prev, curr) => prev + curr.total, 0);
    return order;
};

exports.createQuery = obj => {
    const result = _.pickBy(obj, val => val !== null && val !== undefined);
    return result;
};
