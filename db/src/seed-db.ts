const { Client } = require('pg');

// Create a new instance of the PostgreSQL client with configuration parameters
const client = new Client({
    user: 'your_user', // Database username
    host: 'localhost', // Database server address
    database: 'my_database', // Name of the database
    password: 'your_password', // Database password
    port: 5432, // Port for connecting to the database
});

// Function to initialize the database
async function initializeDB() {
    // Connect to the PostgreSQL database
    await client.connect();

    // Execute a series of SQL queries to set up the database schema
    await client.query(`
        DROP TABLE IF EXISTS "tata_prices"; -- Drop the existing table if it exists
        CREATE TABLE "tata_prices"(
            time            TIMESTAMP WITH TIME ZONE NOT NULL, -- Timestamp of the price data
            price   DOUBLE PRECISION, -- Price of the asset
            volume      DOUBLE PRECISION, -- Trading volume
            currency_code   VARCHAR (10) -- Currency code (e.g., USD, EUR)
        );
        
        SELECT create_hypertable('tata_prices', 'time', 'price', 2); -- Create a hypertable for time-series data
    `);

    // Create a materialized view for 1-minute intervals
    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
        SELECT
            time_bucket('1 minute', time) AS bucket, -- Time bucket for 1-minute intervals
            first(price, time) AS open, -- Opening price
            max(price) AS high, -- Highest price
            min(price) AS low, -- Lowest price
            last(price, time) AS close, -- Closing price
            sum(volume) AS volume, -- Total volume
            currency_code -- Currency code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    // Create a materialized view for 1-hour intervals
    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
        SELECT
            time_bucket('1 hour', time) AS bucket, -- Time bucket for 1-hour intervals
            first(price, time) AS open, -- Opening price
            max(price) AS high, -- Highest price
            min(price) AS low, -- Lowest price
            last(price, time) AS close, -- Closing price
            sum(volume) AS volume, -- Total volume
            currency_code -- Currency code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    // Create a materialized view for 1-week intervals
    await client.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
        SELECT
            time_bucket('1 week', time) AS bucket, -- Time bucket for 1-week intervals
            first(price, time) AS open, -- Opening price
            max(price) AS high, -- Highest price
            min(price) AS low, -- Lowest price
            last(price, time) AS close, -- Closing price
            sum(volume) AS volume, -- Total volume
            currency_code -- Currency code
        FROM tata_prices
        GROUP BY bucket, currency_code;
    `);

    // Close the database connection
    await client.end();
    console.log("Database initialized successfully");
}

// Execute the initializeDB function and catch any errors
initializeDB().catch(console.error);
