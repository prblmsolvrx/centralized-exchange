import { Client } from 'pg';
import { createClient } from 'redis';  
import { DbMessage } from './types';

// Create a PostgreSQL client with configuration parameters
const pgClient = new Client({
    user: 'your_user', // Database username
    host: 'localhost', // Database server address
    database: 'my_database', // Name of the database
    password: 'your_password', // Database password
    port: 5432, // Port for connecting to the database
});

// Connect to the PostgreSQL database
pgClient.connect();

async function main() {
    // Create and connect a Redis client
    const redisClient = createClient();
    await redisClient.connect();
    console.log("Connected to Redis");

    while (true) {
        // Retrieve and remove the last element from the Redis list named "db_processor"
        const response = await redisClient.rPop("db_processor");
        
        if (response) {
            // Parse the retrieved message from Redis
            const data: DbMessage = JSON.parse(response);

            if (data.type === "TRADE_ADDED") {
                // Log and process the trade-added message
                console.log("Adding data");
                console.log(data);

                // Extract price and timestamp from the message
                const price = data.data.price;
                const timestamp = new Date(data.data.timestamp);

                // Define the SQL query for inserting data into the `tata_prices` table
                const query = 'INSERT INTO tata_prices (time, price) VALUES ($1, $2)';
                // Values to be inserted into the database
                const values = [timestamp, price];

                // Execute the SQL query
                await pgClient.query(query, values);
            }
        }

        // Optional: Add a delay to avoid excessive CPU usage
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
    }
}

// Run the main function
main();
