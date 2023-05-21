import * as dotenv from "dotenv";
import FormData from "form-data";
import Mailgun from "mailgun.js";

dotenv.config();
const mailgun = new Mailgun(FormData);

export default mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

export const mgDomain = process.env.MAILGUN_DOMAIN!;
