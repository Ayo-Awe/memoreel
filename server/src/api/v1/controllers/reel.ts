import { Request, Response } from "express";
import * as validator from "../validators/reel";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  BadRequest,
  Conflict,
  ResourceNotFound,
} from "../../../errors/httpErrors";
import db from "../../../db";
import { InferModel, eq } from "drizzle-orm";
import { reels } from "../../../db/schema";
import { createToken } from "../utils/tokenHelpers";
import emailService from "../../shared/services/email";
import agenda from "../../shared/config/agenda";
import moment from "moment";
import { s3Bucket, s3Client } from "../../shared/config/aws";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const REEL_URL_EXPIRES_IN = 15 * 60;

class ReelController {
  async createReelHandler(req: Request, res: Response) {
    if (!req.file) {
      throw new BadRequest("Missing video file", "MISSING_REQUIRED_FIELD");
    }

    const { data, error } = validator.createReelValidator(req.body);

    if (error) {
      // delete reel from s3
      await s3Client.deleteObject({ Bucket: s3Bucket, Key: req.file!.key! });
      throw new BadRequest(error.message, error.code);
    }

    const payload: InferModel<typeof reels, "insert"> = {
      bucketKey: req.file!.key!,
      userEmail: data.email,
      title: data.title,
      deliveryDate: new Date(data.deliveryDate),
      description: data.description,
      confirmationToken: createToken(),
      status: "unconfirmed",
    };

    // Create a new reel and send reel confirmation email
    await db.transaction(async (tx) => {
      await tx.insert(reels).values(payload);
      await emailService.reelConfirmationEmail(
        payload.userEmail,
        payload.confirmationToken!
      );
    });

    res.created({ message: "Reel created. Kindly confirm your email" });
  }

  async reelConfirmationHandler(req: Request, res: Response) {
    const { token } = req.params;

    const reel = await db.query.reels.findFirst({
      where: (table, { eq }) => eq(table.confirmationToken, token),
    });

    if (!reel) {
      throw new BadRequest("Invalid token", "INVALID_REQUEST_PARAMETERS");
    }

    if (moment(reel.deliveryDate).isAfter()) {
      await db
        .update(reels)
        .set({ confirmationToken: null })
        .where(eq(reels.id, reel.id));

      throw new Conflict(
        "Reel delivery date has passed",
        "REEL_CONFIRMATION_OVERDUE"
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .update(reels)
        .set({ status: "shipped", confirmationToken: null })
        .where(eq(reels.id, reel.id));
      await agenda.schedule(reel.deliveryDate, "deliver-reel", {
        id: reel.id,
      });
    });

    res.ok({ message: "Reel has been shipped to the future." });
  }

  async getReel(req: Request, res: Response) {
    const { token } = req.params;

    const reel = await db.query.reels.findFirst({
      where: (table, { eq }) => eq(table.deliveryToken, token),
      columns: {
        bucketKey: false,
        deliveryToken: false,
        confirmationToken: false,
        userId: false,
      },
    });

    if (!reel) {
      throw new ResourceNotFound("Reel not found", "RESOURCE_NOT_FOUND");
    }

    res.ok({ reel });
  }

  async getReelVideo(req: Request, res: Response) {
    const { token } = req.params;

    const reel = await db.query.reels.findFirst({
      where: (table, { eq }) => eq(table.deliveryToken, token),
      columns: {
        bucketKey: true,
      },
    });

    if (!reel) {
      throw new ResourceNotFound("Reel not found", "RESOURCE_NOT_FOUND");
    }

    const bucketParams = {
      Bucket: s3Bucket,
      Key: reel.bucketKey,
    };

    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand(bucketParams),
      { expiresIn: REEL_URL_EXPIRES_IN }
    );

    res.ok({ url });
  }
}

export default new ReelController();
