import { Request, Response } from "express";
import db from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import * as validator from "../validators/me";
import { BadRequest } from "../../../errors/httpErrors";

class UserController {
  async getProfile(req: Request, res: Response) {
    const { uid } = req.user!;

    const user = await db.query.users.findFirst({
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
      with: { socialAccounts: { columns: { userId: false } } },
      where: eq(users.id, uid),
    });

    res.ok({ user });
  }

  async editProfile(req: Request, res: Response) {
    const { uid } = req.user!;

    const { data, error } = validator.editProfileValidator(req.body);
    if (error) throw new BadRequest(error.message, error.code);

    await db.update(users).set(data).where(eq(users.id, uid));

    res.noContent();
  }
}
export default new UserController();
