// Importing constants that represent different types of actions or requests.
// These constants are used to ensure that the action types are consistent
// and prevent errors related to hardcoded strings.

import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, ON_RAMP } from ".";

// Defining the `MessageToEngine` type to represent different types of messages
// that can be sent to the engine. Each message type is associated with a specific
// action and has a corresponding structure for its data.

export type MessageToEngine =
    // Message type for creating an order
    {
        type: typeof CREATE_ORDER;
        data: {
            market: string; // Market identifier
            price: string; // Price at which the order should be placed
            quantity: string; // Quantity of the order
            side: "buy" | "sell"; // Side of the order: buy or sell
            userId: string; // Identifier for the user placing the order
        }
    }
    // Message type for canceling an order
    | {
        type: typeof CANCEL_ORDER;
        data: {
            orderId: string; // Unique identifier for the order to be canceled
            market: string; // Market identifier where the order was placed
        }
    }
    // Message type for on-ramping (e.g., onboarding or initial setup)
    | {
        type: typeof ON_RAMP;
        data: {
            amount: string; // Amount of the on-ramp transaction
            userId: string; // Identifier for the user involved in the transaction
            txnId: string; // Unique transaction identifier
        }
    }
    // Message type for getting depth information (e.g., order book depth)
    | {
        type: typeof GET_DEPTH;
        data: {
            market: string; // Market identifier for which the depth information is requested
        }
    }
    // Message type for getting open orders
    | {
        type: typeof GET_OPEN_ORDERS;
        data: {
            userId: string; // Identifier for the user whose open orders are being requested
            market: string; // Market identifier where the orders are placed
        }
    };
