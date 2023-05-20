import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import responseUtilities from "./api/shared/middlewares/responseUtilities";
import v1Router from "./api/v1/routes";

dotenv.config();
const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(responseUtilities);
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1", v1Router);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening for requests on port ${port} ...`);
});
