export enum BookingStatus {
    PendingPayment = "pending_payment",
    Confirmed = "confirmed",
    Cancelled = "cancelled",
    CheckedIn = "checked_in",
}

export enum PaymentStatus {
    Pending = "pending",
    Paid = "paid",
    Failed = "failed",
    Refunded = "refunded",
}
