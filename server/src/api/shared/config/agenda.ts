import Agenda from "agenda";
import * as dotenv from "dotenv";
dotenv.config();

const mongoConnectionString = process.env.MONGO_URI!;
export default new Agenda({ db: { address: mongoConnectionString } });
