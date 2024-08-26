// Constants for message types
export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";

// Type definition for a subscription message
export type SubscribeMessage = {
    method: typeof SUBSCRIBE,  // Indicates the method type, which is 'SUBSCRIBE'
    params: string[]           // Array of parameters for the subscription
}

// Type definition for an unsubscription message
export type UnsubscribeMessage = {
    method: typeof UNSUBSCRIBE,  // Indicates the method type, which is 'UNSUBSCRIBE'
    params: string[]             // Array of parameters for the unsubscription
}

// Union type for all possible incoming messages
export type IncomingMessage = SubscribeMessage | UnsubscribeMessage;
