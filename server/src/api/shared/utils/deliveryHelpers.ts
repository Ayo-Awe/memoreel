export function buildDeliveryLink(deliveryToken: string) {
  return `${process.env.CLIENT_URL}/reels/${deliveryToken}`;
}
