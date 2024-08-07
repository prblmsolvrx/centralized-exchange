"use strict";

// Exporting constants that represent different actions or types of requests.
// These constants are used to avoid hardcoding strings in multiple places,
// making the code more maintainable and less error-prone.

Object.defineProperty(exports, "__esModule", { value: true });

// Constant for creating an order
exports.CREATE_ORDER = "CREATE_ORDER";

// Constant for canceling an order
exports.CANCEL_ORDER = "CANCEL_ORDER";

// Constant for on-ramping (e.g., onboarding or initial setup)
exports.ON_RAMP = "ON_RAMP";

// Constant for getting depth (e.g., order book depth in trading)
exports.GET_DEPTH = "GET_DEPTH";
