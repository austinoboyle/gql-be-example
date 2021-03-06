/**
 * Custom GraphQL Object Type Definitions
 * @module types
 */

let types = `
    "Possible access levels for users to have"
    enum Access {
        USER
        STOREOWNER
        ADMIN
    }

    """
    Someone awesome enough to make an account with us
    """
    type User {
        id: ID!
        username: String!
        access: Access!
    }

    """
    A place that sells things.
    """
    type Shop {
        id: ID!
        name: String!
        products: [Product!]
        owners: [User!]
    }

    "An item that a store sells"
    type Product {
        id: ID!
        shop_id: ID!
        name: String!
        description: String
        tags: [String!]
        price: Float!
    }

    """
    A **completed** order - ie, the user has **made the purchase**.  
    
    Unlike Carts, Orders have **locked in prices and subtotals**
    """
    type Order {
        id: ID!
        user_id: ID!
        shop_id: ID!
        items: [LineItem!]
        total: Float!
    }

    """
    An order in progress.  Product details in the cart will updates as stores change them.
    """
    type Cart {
        id: ID!
        user_id: ID!
        shop_id: ID!
        items: [LineItem!]
        total: Float!
    }

    """
    Any service/product added to a cart/order, along with any quantities, rates, and prices that pertain to them.
    """
    type LineItem {
        product: Product!
        quantity: Float!
        total: Float!
    }

    """
    Raw MongoDB response when an item is deleted.  Returned whenever a full item is deleted.
    """
    type Deletion {
        ok: Int!
        n: Int!
    }

`;

module.exports = types;
