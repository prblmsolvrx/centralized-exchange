import { createClient } from "redis"; // Import Redis client
import { Engine } from "./trade/Engine"; // Import the Engine class

async function main() {
    // Create a new instance of Engine
    const engine = new Engine(); 

    // Create and connect to the Redis client
    const redisClient = createClient();
    await redisClient.connect();
    console.log("connected to redis");

    // Continuously process messages from the Redis list
    while (true) {
        // Retrieve and remove the last message from the "messages" list
        const response = await redisClient.rPop("messages" as string)
        
        // Check if a message was retrieved
        if (!response) {
            // No message was found, continue waiting
            continue;
        } else {
            // Process the message using the Engine instance
            engine.process(JSON.parse(response));
        }        
    }
}

// Execute the main function
main();
