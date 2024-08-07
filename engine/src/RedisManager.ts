import { DEPTH_UPDATE, TICKER_UPDATE } from "./trade/events"; // Import event types for depth and ticker updates
import { RedisClientType, createClient } from "redis"; // Import Redis client and type
import { ORDER_UPDATE, TRADE_ADDED } from "./types"; // Import types for order updates and trade additions
import { WsMessage } from "./types/toWs"; // Import WebSocket message type
import { MessageToApi } from "./types/toApi"; // Import API message type

// Define a type for messages from the database
type DbMessage = {
    type: typeof TRADE_ADDED, // Type of message indicating a trade was added
    data: {
        id: string, // Trade ID
        isBuyerMaker: boolean, // Whether the buyer is the maker
        price: string, // Price of the trade
        quantity: string, // Quantity of the trade
        quoteQuantity: string, // Quantity in quote currency
        timestamp: number, // Timestamp of the trade
        market: string // Market where the trade occurred
    }
} | {
    type: typeof ORDER_UPDATE, // Type of message indicating an order was updated
    data: {
        orderId: string, // Order ID
        executedQty: number, // Quantity executed
        market?: string, // Market of the order (optional)
        price?: string, // Price of the order (optional)
        quantity?: string, // Quantity of the order (optional)
        side?: "buy" | "sell", // Side of the order (optional)
    }
}

export class RedisManager {
    private client: RedisClientType; // Redis client instance
    private static instance: RedisManager; // Singleton instance of RedisManager

    constructor() {
        this.client = createClient(); // Create a new Redis client
        this.client.connect(); // Connect to Redis
    }

    // Get the singleton instance of RedisManager
    public static getInstance() {
        if (!this.instance)  {
            this.instance = new RedisManager(); // Create a new instance if it doesn't exist
        }
        return this.instance; // Return the singleton instance
    }
  
    // Push a message to the "db_processor" list in Redis
    public pushMessage(message: DbMessage) {
        this.client.lPush("db_processor", JSON.stringify(message)); // Convert the message to JSON and push it to the list
    }

    // Publish a message to a specific Redis channel
    public publishMessage(channel: string, message: WsMessage) {
        this.client.publish(channel, JSON.stringify(message)); // Convert the message to JSON and publish it to the channel
    }

    // Send a message to a specific client through Redis
    public sendToApi(clientId: string, message: MessageToApi) {
        this.client.publish(clientId, JSON.stringify(message)); // Convert the message to JSON and publish it to the client's channel
    }
}
