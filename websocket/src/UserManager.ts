import { WebSocket } from "ws";
import { User } from "./User";
import { SubscriptionManager } from "./SubscriptionManager";

// Singleton class to manage all users and their WebSocket connections
export class UserManager {
    private static instance: UserManager;  // Singleton instance
    private users: Map<string, User> = new Map();  // Map to store users by their unique ID

    // Private constructor to prevent direct instantiation
    private constructor() {
        // Initialization if needed
    }

    // Public method to get the singleton instance of UserManager
    public static getInstance() {
        if (!this.instance)  {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    // Add a new user with a WebSocket connection
    public addUser(ws: WebSocket) {
        const id = this.getRandomId();  // Generate a unique ID for the user
        const user = new User(id, ws);  // Create a new User instance
        this.users.set(id, user);  // Add user to the map
        this.registerOnClose(ws, id);  // Register event handler for WebSocket close event
        return user;  // Return the created user instance
    }

    // Register an event handler to clean up user data on WebSocket close
    private registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            this.users.delete(id);  // Remove user from the map
            SubscriptionManager.getInstance().userLeft(id);  // Notify SubscriptionManager
        });
    }

    // Get a user by their ID
    public getUser(id: string) {
        return this.users.get(id);
    }

    // Generate a random unique ID for a user
    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
