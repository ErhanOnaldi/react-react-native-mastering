export function calculateBookingTotal(
  ticketCount: number,
  pricePerTicket: number,
  discountPercent: number = 0,
): number {
  // Canlı önizlemedeki belirtiyi incele ve Sources panelinde breakpoint koyarak hatayı ayıkla
  const singleDiscount = (pricePerTicket * discountPercent) / 100
  const subtotal = ticketCount * pricePerTicket
  return subtotal - singleDiscount
}
