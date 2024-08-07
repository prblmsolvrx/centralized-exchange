import { RedisClientType, createClient } from "redis";
import { MessageFromOrderbook } from "./types";
import { MessageToEngine } from "./types/to";

export class RedisManager {
    private client: RedisClientType; // Redis client for subscribing to channels
    private publisher: RedisClientType; // Redis client for publishing messages
    private static instance: RedisManager; // Singleton instance of RedisManager

    // Private constructor to prevent direct instantiation
    private constructor() {
        // Create and connect Redis clients
        this.client = createClient();
        this.client.connect();
        this.publisher = createClient();
        this.publisher.connect();
    }

    // Static method to get the singleton instance of RedisManager
    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    // Method to send a message and wait for a response
    public sendAndAwait(message: MessageToEngine): Promise<MessageFromOrderbook> {
        return new Promise<MessageFromOrderbook>((resolve) => {
            const id = this.getRandomClientId(); // Generate a unique client ID
            // Subscribe to the channel with the unique client ID
            this.client.subscribe(id, (message) => {
                this.client.unsubscribe(id); // Unsubscribe after receiving the message
                resolve(JSON.parse(message)); // Parse and resolve the message
            });
            // Publish the message to the "messages" list with the client ID
            this.publisher.lPush("messages", JSON.stringify({ clientId: id, message }));
        });
    }

    // Utility method to generate a random client ID
    public getRandomClientId() {
        // Create a random string of 30 characters
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
