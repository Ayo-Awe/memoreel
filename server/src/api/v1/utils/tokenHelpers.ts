import crypto from "crypto";

export function createToken() {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify([new Date(), crypto.randomUUID()]))
    .digest("hex");
}
