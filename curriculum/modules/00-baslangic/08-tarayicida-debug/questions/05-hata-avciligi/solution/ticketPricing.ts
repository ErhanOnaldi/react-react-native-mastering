export function calculateBookingTotal(
  ticketCount: number,
  pricePerTicket: number,
  discountPercent: number = 0,
): number {
  if (ticketCount <= 0 || pricePerTicket <= 0) {
    return 0
  }

  const subtotal = ticketCount * pricePerTicket
  const validDiscount = Math.max(0, Math.min(100, discountPercent))
  const discountAmount = (subtotal * validDiscount) / 100

  return Math.round(subtotal - discountAmount)
}
