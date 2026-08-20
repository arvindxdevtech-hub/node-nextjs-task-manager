// Backend ka main base URL.
// Yahan /api nahi hai.
export const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";


// Saari REST APIs ke liye common URL.
// Example:
// http://localhost:3000/api
export const API_URL = `${BASE_URL}/api`;