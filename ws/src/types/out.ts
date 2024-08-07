// Type definition for a ticker update message
export type TickerUpdateMessage = {
    type: "ticker",  // Type of the message, which is 'ticker'
    data: {
        c?: string,  // Current price (optional)
        h?: string,  // Highest price (optional)
        l?: string,  // Lowest price (optional)
        v?: string,  // Volume (optional)
        V?: string,  // Total volume (optional)
        s?: string,  // Symbol (optional)
        id: number,  // Unique identifier for the update
        e: "ticker"  // Event type, which is 'ticker'
    }
}

// Type definition for a depth update message
export type DepthUpdateMessage = {
    type: "depth",  // Type of the message, which is 'depth'
    data: {
        b?: [string, string][],  // Bid orders (optional)
        a?: [string, string][],  // Ask orders (optional)
        id: number,  // Unique identifier for the update
        e: "depth"  // Event type, which is 'depth'
    }
}

// Union type for all possible outgoing messages
export type OutgoingMessage = TickerUpdateMessage | DepthUpdateMessage;
