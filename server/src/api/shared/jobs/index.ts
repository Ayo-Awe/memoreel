import Agenda from "agenda";
import reelJobs from "./reel";
import emailJobs from "./email";

export default function (agenda: Agenda) {
  reelJobs(agenda);
  emailJobs(agenda);
}
