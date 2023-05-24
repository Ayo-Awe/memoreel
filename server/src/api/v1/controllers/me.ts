import { Request, Response } from "express";
import db from "../../../db";
import { reels, users } from "../../../db/schema";
import { InferModel, eq } from "drizzle-orm";
import * as validator from "../validators/me";
import {
  BadRequest,
  Forbidden,
  ResourceNotFound,
} from "../../../errors/httpErrors";
import { s3Bucket, s3Client } from "../../shared/config/aws";
import { createToken } from "../utils/tokenHelpers";
import agenda from "../../shared/config/agenda";
import { buildPublicUrl } from "../utils/reelHelpers";

class UserController {
  async getProfile(req: Request, res: Response) {
    const { id } = req.user!;

    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      with: { socialAccounts: { columns: { userId: false } } },
      where: eq(users.id, id),
    });

    res.ok({ user });
  }

  async editProfile(req: Request, res: Response) {
    const { id } = req.user!;

    const { data, error } = validator.editProfileValidator(req.body);
    if (error) throw new BadRequest(error.message, error.code);

    await db.update(users).set(data).where(eq(users.id, id));

    res.noContent();
  }

  async createReelHandler(req: Request, res: Response) {
    const { email } = req.user!;

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
      userEmail: email,
      title: data.title,
      deliveryDate: new Date(data.deliveryDate),
      description: data.description,
      confirmationToken: createToken(),
      status: "shipped",
    };

    // Create a new reel
    await db.transaction(async (tx) => {
      const { insertId: reelId } = (await tx.insert(reels).values(payload))[0];
      await agenda.schedule(payload.deliveryDate, "deliver-reel", {
        id: reelId,
      });
    });

    res.created({ message: "Reel successfully created" });
  }

  async getUserReelsHandler(req: Request, res: Response) {
    const { id, email } = req.user!;

    const reels = await db.query.reels.findMany({
      where: (table, { eq }) => eq(table.userEmail, email),
      columns: {
        bucketKey: false,
        confirmationToken: false,
        deliveryToken: false,
      },
    });

    res.ok({ reels });
  }

  async cancelUserReelHandler(req: Request, res: Response) {
    const { id, email } = req.user!;
    const { id: reelId } = req.params;

    const reel = await db.query.reels.findFirst({
      where: (table, { eq }) => eq(table.id, parseInt(reelId)),
    });

    if (!reel) {
      throw new ResourceNotFound(
        `Reel with id:${reelId} not found`,
        "RESOURCE_NOT_FOUND"
      );
    }

    if (reel.userEmail !== email) {
      throw new Forbidden(
        `You don't have access to reel id:${reelId}`,
        "ACCESS_DENIED"
      );
    }

    // delete reel and/or cancel delivery
    await db.transaction(async (tx) => {
      await tx.delete(reels).where(eq(reels.id, reel.id));
      await agenda.cancel({ name: "deliver-reel", data: { id: reel.id } });
      await s3Client.deleteObject({ Bucket: s3Bucket, Key: reel.bucketKey });
    });

    res.noContent();
  }

  async getReelPublicUrl(req: Request, res: Response) {
    const { email } = req.user!;
    const { id: reelId } = req.params;

    const reel = await db.query.reels.findFirst({
      where: (table, { eq }) => eq(table.id, parseInt(reelId)),
    });

    if (!reel) {
      throw new ResourceNotFound(
        `Reel with id:${reelId} not found`,
        "RESOURCE_NOT_FOUND"
      );
    }

    if (reel.userEmail !== email) {
      throw new Forbidden(
        `You don't have access to reel id:${reelId}`,
        "INSUFFICIENT_PERMISSIONS"
      );
    }

    if (reel.status !== "delivered") {
      throw new Forbidden(
        `Reel cannot be accessed before it is delivered.`,
        "ACCESS_DENIED"
      );
    }

    if (!reel.deliveryToken) {
      throw new ResourceNotFound(
        `No public url available, kindly generate one.`,
        "RESOURCE_NOT_FOUND"
      );
    }

    const publicUrl = buildPublicUrl(reel.deliveryToken);

    res.ok({ publicUrl });
  }

  async regenerateReelPublicUrl(req: Request, res: Response) {
    const { email } = req.user!;
    const { id: reelId } = req.params;

    const reel = await db.query.reels.findFirst({
      where: (table, { eq }) => eq(table.id, parseInt(reelId)),
    });

    if (!reel) {
      throw new ResourceNotFound(
        `Reel with id:${reelId} not found`,
        "RESOURCE_NOT_FOUND"
      );
    }

    if (reel.userEmail !== email) {
      throw new Forbidden(
        `You don't have access to reel id:${reelId}`,
        "INSUFFICIENT_PERMISSIONS"
      );
    }

    if (reel.status !== "delivered") {
      throw new Forbidden(
        `Reel cannot be accessed before it is delivered.`,
        "ACCESS_DENIED"
      );
    }

    const token = createToken();

    // Override previous token
    await db
      .update(reels)
      .set({ deliveryToken: token })
      .where(eq(reels.id, reel.id));

    const publicUrl = buildPublicUrl(token);

    res.ok({ publicUrl });
  }
}
export default new UserController();
