import { Router } from "express";

// Create a new Router instance for handling tickers-related routes
export const tickersRouter = Router();

// Define a GET route for the root path of the tickersRouter
tickersRouter.get("/", async (req, res) => {    
    // Respond with an empty JSON object
    res.json({});
});
