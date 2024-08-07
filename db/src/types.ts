// Define a union type for database messages
export type DbMessage = 
    // Message type for a trade that has been added
    {
        type: "TRADE_ADDED",
        data: {
            id: string, // Unique identifier for the trade
            isBuyerMaker: boolean, // Indicates if the buyer is the maker of the trade
            price: string, // Price at which the trade was executed
            quantity: string, // Quantity of the asset traded
            quoteQuantity: string, // Quantity of the quote asset
            timestamp: number, // Unix timestamp of when the trade occurred
            market: string // Market identifier (e.g., BTC/USD)
        }
    } 
    | 
    // Message type for an order update
    {
        type: "ORDER_UPDATE",
        data: {
            orderId: string, // Unique identifier for the order
            executedQty: number, // Quantity of the order that has been executed
            market?: string, // Optional market identifier (e.g., BTC/USD)
            price?: string, // Optional price at which the order was executed
            quantity?: string, // Optional quantity of the order
            side?: "buy" | "sell", // Optional side of the order (buy or sell)
        }
    }
