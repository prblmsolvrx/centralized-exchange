import { Client } from 'pg'; 

// Create a new instance of the PostgreSQL client
const client = new Client({
    user: 'your_user', // Database username
    host: 'localhost', // Database server address
    database: 'my_database', // Name of the database
    password: 'your_password', // Database password
    port: 5432, // Port on which the database server is listening
});

// Connect to the PostgreSQL database
client.connect();

async function refreshViews() {
    try {
        // Refresh the materialized views
        await client.query('REFRESH MATERIALIZED VIEW klines_1m');
        await client.query('REFRESH MATERIALIZED VIEW klines_1h');
        await client.query('REFRESH MATERIALIZED VIEW klines_1w');

        console.log("Materialized views refreshed successfully");
    } catch (error) {
        console.error("Error refreshing materialized views:", error);
    }
}

// Refresh the materialized views once at startup
refreshViews().catch(console.error);

// Set up an interval to refresh the materialized views every 10 seconds
setInterval(() => {
    refreshViews().catch(console.error);
}, 1000 * 10);
