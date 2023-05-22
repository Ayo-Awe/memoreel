import Agenda from "agenda";
import reelJobs from "./reel";

export default function (agenda: Agenda) {
  /**
   * @todo
   * cycle throw files in this folder and invoke
   * them with agenda object
   */
  reelJobs(agenda);
}
