// Exporting constants that represent different types of actions or requests.
// These constants are used throughout the application to avoid magic strings
// and ensure consistency in handling different actions.

export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";
export const GET_DEPTH = "GET_DEPTH";

// Defining the type `MessageFromOrderbook` to represent different types of messages
// that can be received from the order book. Each message type has a specific
// structure for its payload.

export type MessageFromOrderbook =
    // Message type for order book depth information
    | {
        type: "DEPTH";
        payload: {
            market: string; // Market identifier
            bids: [string, string][]; // List of bid prices and quantities
            asks: [string, string][]; // List of ask prices and quantities
        }
    }
    // Message type for when an order is placed
    | {
        type: "ORDER_PLACED";
        payload: {
            orderId: string; // Unique identifier for the order
            executedQty: number; // Quantity of the order that was executed
            fills: [
                {
                    price: string; // Price at which the order was filled
                    qty: number; // Quantity filled at this price
                    tradeId: number; // Unique identifier for the trade
                }
            ]
        }
    }
    // Message type for when an order is cancelled
    | {
        type: "ORDER_CANCELLED";
        payload: {
            orderId: string; // Unique identifier for the order
            executedQty: number; // Quantity of the order that was executed before cancellation
            remainingQty: number; // Quantity of the order remaining after cancellation
        }
    }
    // Message type for open orders
    | {
        type: "OPEN_ORDERS";
        payload: {
            orderId: string; // Unique identifier for the order
            executedQty: number; // Quantity of the order that was executed
            price: string; // Price at which the order was placed
            quantity: string; // Total quantity of the order
            side: "buy" | "sell"; // Side of the order: buy or sell
            userId: string; // Identifier for the user who placed the order
        }[]
    };
