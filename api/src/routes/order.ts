import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { CREATE_ORDER, CANCEL_ORDER, ON_RAMP, GET_OPEN_ORDERS } from "../types";

// Create a new Express router
export const orderRouter = Router();

// Route to handle creating a new order
orderRouter.post("/", async (req, res) => {
    // Extract order details from the request body
    const { market, price, quantity, side, userId } = req.body;
    console.log({ market, price, quantity, side, userId });

    // TODO: Fix the type of the response object; currently, it is a union type
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market,
            price,
            quantity,
            side,
            userId
        }
    });

    // Send the response payload back to the client
    res.json(response.payload);
});

// Route to handle canceling an existing order
orderRouter.delete("/", async (req, res) => {
    // Extract order details from the request body
    const { orderId, market } = req.body;

    // Send a cancel order request to Redis and wait for a response
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CANCEL_ORDER,
        data: {
            orderId,
            market
        }
    });

    // Send the response payload back to the client
    res.json(response.payload);
});

// Route to retrieve open orders for a user
orderRouter.get("/open", async (req, res) => {
    // Extract query parameters from the request
    const userId = req.query.userId as string;
    const market = req.query.market as string;

    // Send a request to retrieve open orders and wait for a response
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_OPEN_ORDERS,
        data: {
            userId,
            market
        }
    });

    // Send the response payload back to the client
    res.json(response.payload);
});
