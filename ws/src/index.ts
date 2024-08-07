import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

// Create a new WebSocket server listening on port 3001
const wss = new WebSocketServer({ port: 3001 });

// Event handler for when a new WebSocket connection is established
wss.on("connection", (ws) => {
    // Add the new WebSocket connection to the UserManager
    UserManager.getInstance().addUser(ws);
});
