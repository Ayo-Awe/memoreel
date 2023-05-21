import jwt from "jsonwebtoken";

export function createLoginToken(payload: { id: number }) {
  return jwt.sign({ uid: payload.id }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });
}
