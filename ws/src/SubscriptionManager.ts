import { RedisClientType, createClient } from "redis";
import { UserManager } from "./UserManager";

// Singleton class to manage user subscriptions and handle Redis interactions
export class SubscriptionManager {
    private static instance: SubscriptionManager;  // Singleton instance
    private subscriptions: Map<string, string[]> = new Map();  // User subscriptions: userId => list of subscriptions
    private reverseSubscriptions: Map<string, string[]> = new Map();  // Reverse subscriptions: subscription => list of userIds
    private redisClient: RedisClientType;  // Redis client for subscription management

    // Private constructor to prevent direct instantiation
    private constructor() {
        // Initialize and connect Redis client
        this.redisClient = createClient();
        this.redisClient.connect();
    }

    // Public method to get the singleton instance of SubscriptionManager
    public static getInstance() {
        if (!this.instance)  {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }

    // Subscribe a user to a subscription channel
    public subscribe(userId: string, subscription: string) {
        // Check if the user is already subscribed to the channel
        if (this.subscriptions.get(userId)?.includes(subscription)) {
            return;
        }

        // Add subscription to user's list and reverse mapping
        this.subscriptions.set(userId, (this.subscriptions.get(userId) || []).concat(subscription));
        this.reverseSubscriptions.set(subscription, (this.reverseSubscriptions.get(subscription) || []).concat(userId));
        
        // Subscribe to the Redis channel if it's the first user subscribing
        if (this.reverseSubscriptions.get(subscription)?.length === 1) {
            this.redisClient.subscribe(subscription, this.redisCallbackHandler);
        }
    }

    // Handler for Redis messages
    private redisCallbackHandler = (message: string, channel: string) => {
        // Parse the message and emit it to all subscribed users
        const parsedMessage = JSON.parse(message);
        this.reverseSubscriptions.get(channel)?.forEach(s => UserManager.getInstance().getUser(s)?.emit(parsedMessage));
    }

    // Unsubscribe a user from a subscription channel
    public unsubscribe(userId: string, subscription: string) {
        // Remove subscription from user's list
        const subscriptions = this.subscriptions.get(userId);
        if (subscriptions) {
            this.subscriptions.set(userId, subscriptions.filter(s => s !== subscription));
        }

        // Remove user from subscription's list and unsubscribe from Redis if no users left
        const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
        if (reverseSubscriptions) {
            this.reverseSubscriptions.set(subscription, reverseSubscriptions.filter(s => s !== userId));
            if (this.reverseSubscriptions.get(subscription)?.length === 0) {
                this.reverseSubscriptions.delete(subscription);
                this.redisClient.unsubscribe(subscription);
            }
        }
    }

    // Handle user disconnection and clean up subscriptions
    public userLeft(userId: string) {
        console.log("user left " + userId);
        this.subscriptions.get(userId)?.forEach(s => this.unsubscribe(userId, s));
    }
    
    // Get a list of subscriptions for a specific user
    getSubscriptions(userId: string) {
        return this.subscriptions.get(userId) || [];
    }
}
