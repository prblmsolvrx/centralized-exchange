import { describe, expect, it } from "vitest";  // Import testing utilities from 'vitest' for writing and running tests
import { Orderbook } from "../trade/Orderbook";  // Import the Orderbook class which will be tested

// Test suite for simple order operations
describe("Simple orders", () => {
    // Test case for adding an order to an empty orderbook
    it("Empty orderbook should not be filled", () => {
        // Create a new Orderbook instance with no initial orders
        const orderbook = new Orderbook("TATA", [], [], 0, 0);
        // Define an order that should not be able to fill because the orderbook is empty
        const order = {
            price: 1000,
            quantity: 1,
            orderId: "1",
            filled: 0,
            side: "buy" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "1"
        };
        // Add the order to the orderbook and get the result
        const { fills, executedQty } = orderbook.addOrder(order);
        // Assert that no fills occurred and no quantity was executed
        expect(fills.length).toBe(0);
        expect(executedQty).toBe(0);
    });

    // Test case for partially filling an order
    it("Can be partially filled", () => {
        // Create a new Orderbook instance with an initial order
        const orderbook = new Orderbook("TATA", [{
            price: 1000,
            quantity: 1,
            orderId: "1",
            filled: 0,
            side: "buy" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "1"
        }], [], 0, 0);

        // Define an order that should partially fill the existing order
        const order = {
            price: 1000,
            quantity: 2,
            orderId: "2",
            filled: 0,
            side: "sell" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "2"
        };

        // Add the order to the orderbook and get the result
        const { fills, executedQty } = orderbook.addOrder(order);
        // Assert that the order resulted in one fill and one unit of quantity executed
        expect(fills.length).toBe(1);
        expect(executedQty).toBe(1);
    });

    // Test case for partially filling an order with bids and asks
    it("Can be partially filled", () => {
        // Create a new Orderbook instance with existing bids and asks
        const orderbook = new Orderbook("TATA", [{
            price: 999,
            quantity: 1,
            orderId: "1",
            filled: 0,
            side: "buy" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "1"
        }],
        [{
            price: 1001,
            quantity: 1,
            orderId: "2",
            filled: 0,
            side: "sell" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "2"
        }], 0, 0);

        // Define an order that should partially fill the existing sell order
        const order = {
            price: 1001,
            quantity: 2,
            orderId: "3",
            filled: 0,
            side: "buy" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "3"
        };

        // Add the order to the orderbook and get the result
        const { fills, executedQty } = orderbook.addOrder(order);
        // Assert that the order resulted in one fill and one unit of quantity executed
        expect(fills.length).toBe(1);
        expect(executedQty).toBe(1);
        // Assert that the orderbook has updated bids and no asks
        expect(orderbook.bids.length).toBe(2);
        expect(orderbook.asks.length).toBe(0);
    });
});

// Test suite for self-trade prevention
describe("Self trade prevention", () => {
    // Test case for preventing self-trades
    it.todo("User cant self trade", () => {
        // Create a new Orderbook instance with existing orders
        const orderbook = new Orderbook("TATA", [{
            price: 999,
            quantity: 1,
            orderId: "1",
            filled: 0,
            side: "buy" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "1"
        }],
        [{
            price: 1001,
            quantity: 1,
            orderId: "2",
            filled: 0,
            side: "sell" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "2"
        }], 0, 0);

        // Define an order that would result in a self-trade
        const order = {
            price: 999,
            quantity: 2,
            orderId: "3",
            filled: 0,
            side: "sell" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "3"
        };

        // Add the order to the orderbook and get the result
        const { fills, executedQty } = orderbook.addOrder(order);
        // Assert that no fills occurred and no quantity was executed
        expect(fills.length).toBe(0);
        expect(executedQty).toBe(0);
    });
});

// Test suite for precision errors
describe("Precision errors are taken care of", () => {
    // Test case for handling precision errors with decimal quantities
    it.todo("Bid doesn't persist even with decimals", () => {
        // Create a new Orderbook instance with bids and asks having decimal quantities
        const orderbook = new Orderbook("TATA", [{
            price: 999,
            quantity: 0.551123,
            orderId: "1",
            filled: 0,
            side: "buy" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "1"
        }],
        [{
            price: 1001,
            quantity: 0.551,
            orderId: "2",
            filled: 0,
            side: "sell" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "2"
        }], 0, 0);

        // Define an order that should interact with the existing bids and asks
        const order = {
            price: 999,
            quantity: 0.551123,
            orderId: "3",
            filled: 0,
            side: "sell" as ("buy" | "sell"),  // Ensure the side is either 'buy' or 'sell'
            userId: "3"
        };

        // Add the order to the orderbook and get the result
        const { fills, executedQty } = orderbook.addOrder(order);
        // Assert that the order resulted in one fill and update orderbook accordingly
        expect(fills.length).toBe(1);
        expect(orderbook.bids.length).toBe(0);
        expect(orderbook.asks.length).toBe(1);
    });
});
