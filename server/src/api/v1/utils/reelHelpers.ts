export function buildPublicUrl(deliveryToken: string) {
  return `${process.env.CLIENT_URL}/reels/view?t=${deliveryToken}`;
}
