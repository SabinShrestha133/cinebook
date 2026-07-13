import { BookingPayload, createBooking } from "@/lib/api/booking";

export const submitBooking = async (payload: BookingPayload) => {
    return await createBooking(payload);
};
