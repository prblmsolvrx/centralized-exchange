import { describe, expect, it, vi } from "vitest";  // Import testing utilities from 'vitest' for writing and running tests
import { Engine } from "../trade/Engine";  // Import the Engine class which will be tested
import { RedisManager } from "../RedisManager";  // Import the RedisManager class which is used by Engine
import { CREATE_ORDER } from "../types/fromApi";  // Import the CREATE_ORDER constant from types

// Mock the RedisManager singleton
vi.mock("../RedisManager", () => ({
    // Define how the RedisManager module should be mocked
    RedisManager: {
        getInstance: () => ({
            // Mock methods of the RedisManager instance
            publishMessage: vi.fn(),  // Create a mock function for publishMessage
            sendToApi: vi.fn(),  // Create a mock function for sendToApi
            pushMessage: vi.fn()  // Create a mock function for pushMessage
        })
    }
}));

describe("Engine", () => {  // Start a test suite for the Engine class
    it("Publishes Trade updates", () => {  // Define a test case to check if Trade updates are published correctly
        const engine = new Engine();  // Create an instance of the Engine class

        // Get the mocked instance of RedisManager
        const redisManagerInstance = RedisManager.getInstance();  
        // Spy on the publishMessage method to monitor its calls
        const publishMessageSpy = vi.spyOn(redisManagerInstance, "publishMessage");

        // Process the first message through the Engine
        engine.process({
            message: {
                type: CREATE_ORDER,  // Type of the message
                data: {  // Data associated with the CREATE_ORDER message
                    market: "TATA_INR",  // Market identifier
                    price: "1000",  // Price of the order
                    quantity: "1",  // Quantity of the order
                    side: "buy",  // Side of the order (buy or sell)
                    userId: "1"  // User identifier
                }
            },
            clientId: "1"  // Client identifier
        });

        // Process the second message through the Engine
        engine.process({
            message: {
                type: CREATE_ORDER,  // Type of the message
                data: {  // Data associated with the CREATE_ORDER message
                    market: "TATA_INR",  // Market identifier
                    price: "1001",  // Price of the order
                    quantity: "1",  // Quantity of the order
                    side: "sell",  // Side of the order (buy or sell)
                    userId: "2"  // User identifier
                }
            },
            clientId: "1"  // Client identifier
        });

        // Assert that the publishMessage method was called twice
        expect(publishMessageSpy).toHaveBeenCalledTimes(2);
    });
});
