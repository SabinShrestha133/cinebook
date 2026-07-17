import dotenv from "dotenv";
dotenv.config(); // implement .env file

export const PORT: number = Number(process.env.PORT) || 8089;
export const HOST: string = process.env.HOST || "localhost";
export const DUMMY: string = process.env.DUMMY || "Dummy Export";    
export const MONGODB_URL: string = 
    process.env.MONGODB_URL || "mongodb://localhost:27017/class-36a-db";
export const SECRET_KEY: string = 
    process.env.SECRET_KEY || "merosecretkey";

export const EMAIL_USER: string =
    process.env.EMAIL_USER || "example@gmail.com";
export const EMAIL_PASS: string =
    process.env.EMAIL_PASS || "password123";
export const CLIENT_URL: string =
    process.env.CLIENT_URL || 'http://localhost:3001';

export const KHALTI_SECRET_KEY: string =
    process.env.KHALTI_SECRET_KEY || "";
export const KHALTI_INITIATE_URL: string =
    process.env.KHALTI_INITIATE_URL || "https://dev.khalti.com/api/v2/epayment/initiate/";
export const KHALTI_VERIFY_URL: string =
    process.env.KHALTI_VERIFY_URL || "https://dev.khalti.com/api/v2/epayment/lookup/";
export const BOOKING_EXPIRY_MINUTES: number =
    Number(process.env.BOOKING_EXPIRY_MINUTES) || 10;
