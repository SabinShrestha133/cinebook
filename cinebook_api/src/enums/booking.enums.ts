export enum BookingStatus {
    PendingPayment = "pending_payment",
    Reserved = "reserved",
    Confirmed = "confirmed",
    CheckedIn = "checked_in",
    Cancelled = "cancelled",
    Expired = "expired",
}

export enum PaymentStatus {
    Pending = "pending",
    Paid = "paid",
    Failed = "failed",
    Refunded = "refunded",
}
