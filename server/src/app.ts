import express from "express";
import dotenv from "dotenv";
import v1Router from "./v1/routes";
import cors from "cors";

dotenv.config();
const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/v1", v1Router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening for requests on port ${port}...`);
});
