import axios from "axios";
import { BookingStatus, PaymentStatus } from "../enums/booking.enums";
import {
    KHALTI_SECRET_KEY,
    KHALTI_INITIATE_URL,
    KHALTI_VERIFY_URL,
    BOOKING_EXPIRY_MINUTES,
    CLIENT_URL,
} from "../configs/constant";

export interface KhaltiInitiateResponse {
    pidx: string;
    payment_url?: string;
    paymentUrl?: string;
    expiresAt?: string;
    expires_at?: string;
}

export interface KhaltiVerifyResponse {
    status: "Completed" | "Pending" | "Failed" | string;
    total_amount?: number;
    totalAmount?: number;
    transaction_id?: string;
    transactionId?: string;
    pidx: string;
    purchase_order_id?: string;
    purchaseOrderId?: string;
    purchase_order_name?: string;
    purchaseOrderName?: string;
}

export class PaymentService {
    async initiatePayment(
        bookingId: string,
        amount: number,
        customerInfo: { name: string; email: string; phone: string }
    ) {
        const payload = {
            return_url: `${CLIENT_URL}/booking/verify`,
            website_url: CLIENT_URL || "http://localhost:3000",
            amount: Math.round(amount * 100),
            purchase_order_id: bookingId,
            purchase_order_name: "Movie Ticket Booking",
            customer_info: customerInfo,
        };

        const response = await axios.post<KhaltiInitiateResponse>(
            KHALTI_INITIATE_URL,
            payload,
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;
        return {
            pidx: data.pidx,
            paymentUrl: data.payment_url || data.paymentUrl,
            expiresAt: data.expires_at || data.expiresAt,
        };
    }

    async verifyPayment(pidx: string): Promise<KhaltiVerifyResponse> {
        const response = await axios.post<KhaltiVerifyResponse>(
            KHALTI_VERIFY_URL,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    }

    getExpiryMinutes(): number {
        return BOOKING_EXPIRY_MINUTES;
    }
}

export const paymentService = new PaymentService();
