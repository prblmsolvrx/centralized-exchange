import { WebSocket } from "ws";
import { OutgoingMessage } from "./types/out";
import { SubscriptionManager } from "./SubscriptionManager";
import { IncomingMessage, SUBSCRIBE, UNSUBSCRIBE } from "./types/in";

// Class representing a user with WebSocket connection
export class User {
    private id: string;           // Unique identifier for the user
    private ws: WebSocket;       // WebSocket connection for the user
    private subscriptions: string[] = [];  // List of subscriptions for the user

    // Constructor to initialize user with an ID and WebSocket connection
    constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
        this.addListeners();  // Add event listeners to WebSocket connection
    }

    // Add a subscription to the user's list
    public subscribe(subscription: string) {
        this.subscriptions.push(subscription);
    }

    // Remove a subscription from the user's list
    public unsubscribe(subscription: string) {
        this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    }

    // Send a message to the user through WebSocket
    emit(message: OutgoingMessage) {
        this.ws.send(JSON.stringify(message));
    }

    // Add listeners to handle incoming messages
    private addListeners() {
        // Event handler for incoming messages
        this.ws.on("message", (message: string) => {
            const parsedMessage: IncomingMessage = JSON.parse(message);
            
            // Handle subscription messages
            if (parsedMessage.method === SUBSCRIBE) {
                parsedMessage.params.forEach(s => SubscriptionManager.getInstance().subscribe(this.id, s));
            }

            // Handle unsubscription messages
            if (parsedMessage.method === UNSUBSCRIBE) {
                parsedMessage.params.forEach(s => SubscriptionManager.getInstance().unsubscribe(this.id, s));
            }
        });
    }
}
