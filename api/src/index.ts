import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/order";
import { depthRouter } from "./routes/depth";
import { tradesRouter } from "./routes/trades";
import { klineRouter } from "./routes/kline";
import { tickersRouter } from "./routes/ticker";

// Create an instance of the Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) to allow requests from different origins
app.use(cors());

// Parse incoming JSON requests and make the data available under `req.body`
app.use(express.json());

// Register routes for handling different API endpoints

// Route for handling order-related requests
app.use("/api/v1/order", orderRouter);

// Route for handling depth-related requests (e.g., order book depth)
app.use("/api/v1/depth", depthRouter);

// Route for handling trade-related requests
app.use("/api/v1/trades", tradesRouter);

// Route for handling kline (candlestick) data requests
app.use("/api/v1/klines", klineRouter);

// Route for handling ticker-related requests (e.g., price tickers)
app.use("/api/v1/tickers", tickersRouter);

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
