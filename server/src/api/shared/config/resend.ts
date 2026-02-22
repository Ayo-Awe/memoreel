import { Resend } from "resend";
import * as dotenv from "dotenv";

dotenv.config();

export default new Resend(process.env.RESEND_API_KEY!);
