import { Client } from 'pg'; // Importing PostgreSQL client
import { Router } from 'express'; // Importing Express Router for route handling
import { RedisManager } from '../RedisManager'; // Importing RedisManager, though it's not used in this snippet

// Setting up PostgreSQL client with connection parameters
const pgClient = new Client({
    user: 'your_user', // Database username
    host: 'localhost', // Database host
    database: 'my_database', // Database name
    password: 'your_password', // Database password
    port: 5432, // Database port
});

// Connect to PostgreSQL database
pgClient.connect();

// Creating a new router instance for handling routes related to klines
export const klineRouter = Router();

// Handling GET requests to the root endpoint of this router
klineRouter.get("/", async (req, res) => {
    // Extracting query parameters from the request
    const { market, interval, startTime, endTime } = req.query;

    let query;
    // Building SQL query based on the interval parameter
    switch (interval) {
        case '1m':
            query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1h':
            query = `SELECT * FROM klines_1h WHERE bucket >= $1 AND bucket <= $2`; // Fixed table name from klines_1m to klines_1h
            break;
        case '1w':
            query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2`;
            break;
        default:
            // Respond with a 400 status code for invalid interval
            return res.status(400).send('Invalid interval');
    }

    try {
        // Querying the PostgreSQL database
        //@ts-ignore
        const result = await pgClient.query(query, [new Date(startTime as string * 1000), new Date(endTime as string * 1000)]);
        // Sending the query result as JSON response
        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume,
        })));
    } catch (err) {
        // Logging and sending error response in case of an exception
        console.log(err);
        res.status(500).send(err);
    }
});
