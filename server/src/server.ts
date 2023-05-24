import agenda from "./api/shared/config/agenda";
import registerJobs from "./api/shared/jobs";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`Listening for requests on port ${port} ...`);
  registerJobs(agenda);
  await agenda.start();
  console.log("Agenda started successfully");
});
