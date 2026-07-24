import { BookingPayload, createBooking, initiatePayment, verifyPayment, cancelBooking } from "@/lib/api/booking";

export const submitBooking = async (payload: BookingPayload) => {
    return await createBooking(payload);
};

export const payBooking = async (bookingId: string, customerInfo: { name: string; email: string; phone: string }) => {
    return await initiatePayment(bookingId, customerInfo);
};

export const verifyBookingPayment = async (pidx: string) => {
    return await verifyPayment(pidx);
};

export const cancelUserBooking = async (bookingId: string) => {
    return await cancelBooking(bookingId);
};
