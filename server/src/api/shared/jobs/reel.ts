import Agenda, { Job } from "agenda";
import db from "../../../db";
import { createToken } from "../../v1/utils/tokenHelpers";
import { reels } from "../../../db/schema";
import { eq } from "drizzle-orm";
import emailService from "../services/email";
import { buildDeliveryLink } from "../utils/deliveryHelpers";
import { MissingReelError } from "../../../errors/jobErrors";
import moment from "moment";

export interface DeliveryData {
  title: string;
  description: string | null;
  createdAt: string;
  link: string;
}

export default function (agenda: Agenda) {
  interface Reel {
    id: number;
  }

  agenda.define<Reel>("deliver-reel", async (job: Job<Reel>) => {
    const reel = await db.query.reels.findFirst({
      where: (table, { eq }) => eq(table.id, job.attrs.data.id),
    });

    if (!reel) {
      throw new MissingReelError(
        `Reel with id: ${job.attrs.data.id} not found`
      );
    }

    await db.transaction(async (tx) => {
      const deliveryToken = createToken();
      await db
        .update(reels)
        .set({ deliveryToken, status: "delivered" })
        .where(eq(reels.id, reel.id));

      const payload: DeliveryData = {
        createdAt: moment(reel.createdAt).format("dddd, MMMM Do YYYY"),
        title: reel.title,
        description: reel.description,
        link: buildDeliveryLink(deliveryToken),
      };
      await emailService.reelDeliveryEmail(reel.userEmail, payload);
    });
  });

  agenda.on("fail:deliver-reel", async (err, job: Job<Reel>) => {
    // Update reel status to failed
    if (err instanceof MissingReelError === false) {
      await db
        .update(reels)
        .set({ status: "failed" })
        .where(eq(reels.id, job.attrs.data.id));
    }
  });
}
