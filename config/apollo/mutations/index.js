const { createUser, deleteUser } = require("./users");
const { addToCart, updateItemQuantity } = require("./carts");
const { submitOrder, returnItem } = require("./orders");
const { createShop, deleteShop } = require("./shops");
const { createProduct, deleteProduct, updateProduct } = require("./products");

exports.mutationTypes = `
    type Mutation{
        """
        Create a new user.
        
        **Access Necessary:** None
        """
        createUser(username: String!): User!

        """
        Delete a user by id.

        **Access Necessary:** Account owner
        """
        deleteUser(user_id: ID!): Deletion

        """
        Add a LineItem to a cart

        **Access Necessary:** Account owner
        """
        addToCart(user_id: ID!, shop_id: ID!, product_id: ID!, quantity: Float = 1): Cart!
        
        """
        Update item quantity in cart

        **Access Necessary:** Account owner
        """
        updateItemQuantity(user_id: ID!, shop_id: ID!, product_id: ID!, quantity: Float): Cart!
        
        """
        Make a purchase

        **Access Necessary:** Account owner
        """
        submitOrder(user_id: ID!, shop_id: ID!): Order!

        """
        Return an item.  If quantity is specified, only that many are returned,
        otherwise all of the items with the product_id given are returned.

        **Access Necessary:** Account owner
        """
        returnItem(order_id: ID!, product_id: ID!, quantity: Float): Order!
        
        """
        Create a new shop on the platform

        **Access Necessary:** USER
        """
        createShop(name: String!): Shop!

        """
        Delete a shop

        **Access Necessary:** STOREOWNER
        """
        deleteShop(shop_id: String!): Deletion!

        """
        Add a new product to shop's inventory

        **Access Necessary:** STOREOWNER
        """
        createProduct(name: String!, price: Float!, shop_id: ID!): Product!

        """
        Update a product's details (name, price, etc)

        **Access Necessary:** STOREOWNER
        """
        updateProduct(shop_id: ID!, product_id: ID!, name: String, price: Float): Product!
        
        """
        Remove a product from shop's inventory

        **Access Necessary:** STOREOWNER
        """
        deleteProduct(shop_id: ID!, product_id: ID!): Deletion!
    }
`;

exports.mutationResolvers = {
    createUser,
    deleteUser,
    addToCart,
    updateItemQuantity,
    submitOrder,
    returnItem,
    createShop,
    deleteShop,
    createProduct,
    updateProduct,
    deleteProduct
};
