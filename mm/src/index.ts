import axios from "axios";

// Constants for the base URL, total bids/asks, market, and user ID
const BASE_URL = "http://localhost:3000";
const TOTAL_BIDS = 15;
const TOTAL_ASK = 15;
const MARKET = "TATA_INR";
const USER_ID = "5";

// Main function to handle bidding and asking logic
async function main() {
    // Generate a random price around 1000
    const price = 1000 + Math.random() * 10;

    // Fetch open orders for the user and market
    const openOrders = await axios.get(`${BASE_URL}/api/v1/order/open?userId=${USER_ID}&market=${MARKET}`);

    // Count current total bids and asks
    const totalBids = openOrders.data.filter((o: any) => o.side === "buy").length;
    const totalAsks = openOrders.data.filter((o: any) => o.side === "sell").length;

    // Cancel bids that are more than the current price and asks that are less than the current price
    const cancelledBids = await cancelBidsMoreThan(openOrders.data, price);
    const cancelledAsks = await cancelAsksLessThan(openOrders.data, price);

    // Calculate how many bids and asks need to be added
    let bidsToAdd = TOTAL_BIDS - totalBids - cancelledBids;
    let asksToAdd = TOTAL_ASK - totalAsks - cancelledAsks;

    // Add bids and asks until the required number is reached
    while(bidsToAdd > 0 || asksToAdd > 0) {
        if (bidsToAdd > 0) {
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (price - Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "buy",
                userId: USER_ID
            });
            bidsToAdd--;
        }
        if (asksToAdd > 0) {
            await axios.post(`${BASE_URL}/api/v1/order`, {
                market: MARKET,
                price: (price + Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "sell",
                userId: USER_ID
            });
            asksToAdd--;
        }
    }

    // Wait for 1 second before repeating the process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Re-run the main function
    main();
}

// Function to cancel bids that are higher than the given price or randomly with a 10% chance
async function cancelBidsMoreThan(openOrders: any[], price: number) {
    let promises: any[] = [];
    openOrders.map(o => {
        if (o.side === "buy" && (o.price > price || Math.random() < 0.1)) {
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
        }
    });
    await Promise.all(promises);
    return promises.length;
}

// Function to cancel asks that are lower than the given price or randomly with a 50% chance
async function cancelAsksLessThan(openOrders: any[], price: number) {
    let promises: any[] = [];
    openOrders.map(o => {
        if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
            promises.push(axios.delete(`${BASE_URL}/api/v1/order`, {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            }));
        }
    });

    await Promise.all(promises);
    return promises.length;
}

// Start the main function
main();
