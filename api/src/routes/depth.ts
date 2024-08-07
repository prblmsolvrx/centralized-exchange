import { Router } from "express"; // Import the Router class from the express module
import { RedisManager } from "../RedisManager"; // Import the RedisManager class for interacting with Redis
import { GET_DEPTH } from "../types"; // Import the GET_DEPTH type constant

// Create a new instance of Router for handling depth-related routes
export const depthRouter = Router();

// Define a route handler for GET requests to the root path of the depthRouter
depthRouter.get("/", async (req, res) => {
    // Extract the 'symbol' query parameter from the request
    const { symbol } = req.query;
    
    // Get an instance of RedisManager and send a request to get depth data
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_DEPTH, // Specify the type of request
        data: {
            market: symbol as string // Pass the 'symbol' parameter as the market value
        }
    });

    // Send the payload from the response as JSON to the client
    res.json(response.payload);
});
