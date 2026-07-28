export interface Discount {
    discountType: "percentage" | "fixed";
    discountValue: number;
}

export function calculateEffectivePrice(basePrice: number, discounts: Discount[] = []): number {
    let price = basePrice;
    for (const discount of discounts) {
        if (discount.discountType === "percentage") {
            price = price * (1 - discount.discountValue / 100);
        } else {
            price = Math.max(0, price - discount.discountValue);
        }
    }
    return Math.round(price * 100) / 100;
}
