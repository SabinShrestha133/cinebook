import dotenv from "dotenv";
dotenv.config(); // implement .env file

// Add fallback value from env for stability
export const PORT: number = Number(process.env.PORT) || 5000; // default port is 5000
export const HOST: string = process.env.HOST || "0.0.0.0"; // bind to all interfaces for mobile access
export const DUMMY: string = process.env.DUMMY || "Dummy Export";    
export const MONGODB_URL: string = 
    process.env.MONGODB_URL || "mongodb://localhost:27017/class-36a-db"; // default MongoDB URL
export const SECRET_KEY: string = 
    process.env.SECRET_KEY || "merosecretkey";
// same as 
// export {
//     PORT,
//     DUMMY,
//     MONGODB_URL
// }