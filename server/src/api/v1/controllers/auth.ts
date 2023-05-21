import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { Request, Response } from "express";
import _ from "lodash";
import moment from "moment";

import db from "../../../db";
import { userSocialAccounts, users } from "../../../db/schema";
import {
  BadRequest,
  Conflict,
  Forbidden,
  ResourceNotFound,
} from "../../../errors/httpErrors";
import emailService from "../../shared/services/email";
import { createLoginToken } from "../../shared/utils/authHelpers";
import * as validators from "../validators/auth";
import * as bcrypt from "bcrypt";
import { googleClient } from "../../shared/config/googleOauth";

export async function registerHandler(req: Request, res: Response) {
  // Validate request body
  const { data, error } = validators.registerValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  // Check for existing users
  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, data.email),
  });

  if (existingUser)
    throw new Conflict(
      `User with email(${data.email}) already exists`,
      "EXISTING_USER_EMAIL"
    );
  // create verification token and send verification email
  const confirmationToken = crypto
    .createHash("sha256")
    .update(JSON.stringify([moment(), data]))
    .digest("hex");

  const confirmationTokenExpiresAt = moment().add(30, "minutes").toDate();

  await db.transaction(async (tx) => {
    const hash = await bcrypt.hash(data.password, 10);
    data.password = hash;

    await tx.insert(users).values({
      ...data,
      confirmationToken,
      confirmationTokenExpiresAt,
    });

    await emailService.verificationEmail(data.email, confirmationToken);
  });

  res.created({ message: "Email verification sent" });
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const { data, error } = validators.emailVerificationValidator(req.body);

  if (error) throw new BadRequest(error.message, error.code);

  // Check for existing users
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.confirmationToken, data.token),
  });

  if (!user)
    throw new BadRequest("Invalid token", "INVALID_REQUEST_PARAMETERS");

  if (user.verified)
    throw new BadRequest(
      "Email is already confirmed",
      "EMAIL_ALREADY_VERIFIED"
    );

  // Check if token is expired and resend a new token
  const now = moment();
  if (moment(user.confirmationTokenExpiresAt).isBefore(now)) {
    // create verification token and send verification email
    const confirmationToken = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");

    const confirmationTokenExpiresAt = moment().add(30, "minutes").toDate();

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          confirmationToken,
          confirmationTokenExpiresAt,
        })
        .where(eq(users.id, user.id));

      await emailService.verificationEmail(user.email, confirmationToken);
    });

    throw new BadRequest(
      "Token Expired. New email has been sent",
      "INVALID_REQUEST_PARAMETERS"
    );
  }

  await db
    .update(users)
    .set({
      confirmationToken: null,
      confirmationTokenExpiresAt: null,
      verified: true,
    })
    .where(eq(users.id, user.id));

  res.setHeader("X-API-TOKEN", createLoginToken({ id: user.id }));

  res.ok({ user: _.pick(user, ["id", "firstName", "lastName", "email"]) });
}

export async function resendVerificationEmail(req: Request, res: Response) {
  const { data, error } = validators.resendVerificationEmailValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, data.email),
  });

  if (!user) {
    throw new ResourceNotFound(
      "User with email address not found",
      "RESOURCE_NOT_FOUND"
    );
  }

  if (user.verified) {
    throw new BadRequest(
      "Email is already confirmed",
      "EMAIL_ALREADY_VERIFIED"
    );
  }

  // create verification token and send verification email
  const confirmationToken = crypto
    .createHash("sha256")
    .update(JSON.stringify([data, moment()]))
    .digest("hex");

  const confirmationTokenExpiresAt = moment().add(30, "minutes").toDate();

  await db.transaction(async (tx) => {
    const payload = {
      confirmationToken,
      confirmationTokenExpiresAt,
    };
    await db.update(users).set(payload).where(eq(users.id, user.id));
    await emailService.verificationEmail(user.email, confirmationToken);
  });

  res.ok({ message: "Verification email sent." });
}

export async function loginHandler(req: Request, res: Response) {
  const { data, error } = validators.loginValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, data.email),
  });

  if (!user) {
    throw new ResourceNotFound(
      `User with email (${data.email}) not found`,
      "RESOURCE_NOT_FOUND"
    );
  }

  // Oauth users don't have passwords
  if (!user.password) {
    throw new BadRequest(
      `Invalid email/password.`,
      "INVALID_REQUEST_PARAMETERS"
    );
  }

  // Compare user passwords
  const match = await bcrypt.compare(data.password, user.password);

  if (!match) {
    throw new BadRequest(
      `Invalid email/password.`,
      "INVALID_REQUEST_PARAMETERS"
    );
  }

  if (!user.verified) {
    // create verification token and send verification email
    const confirmationToken = crypto
      .createHash("sha256")
      .update(JSON.stringify([data, moment()]))
      .digest("hex");

    const confirmationTokenExpiresAt = moment().add(30, "minutes").toDate();

    await db.transaction(async (tx) => {
      const payload = {
        confirmationToken,
        confirmationTokenExpiresAt,
      };
      await tx.update(users).set(payload).where(eq(users.id, user.id));
      await emailService.verificationEmail(user.email, confirmationToken);
    });

    throw new Forbidden(
      "Please confirm your email address.",
      "USER_NOT_VERIFIED"
    );
  }

  res.setHeader("X-API-TOKEN", createLoginToken({ id: user.id }));

  res.ok({ user: _.pick(user, ["id", "firstName", "lastName", "email"]) });
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const { data, error } = validators.forgotPasswordValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, data.email),
  });

  if (!user) {
    throw new ResourceNotFound(
      `User with email (${data.email}) not found`,
      "RESOURCE_NOT_FOUND"
    );
  }

  // Create password token and expiry
  const payload = {
    passwordToken: crypto
      .createHash("sha256")
      .update(JSON.stringify([moment(), data]))
      .digest("hex"),
    passwordTokenExpiresAt: moment().add(25, "minutes").toDate(),
  };

  await db.transaction(async (tx) => {
    await tx.update(users).set(payload).where(eq(users.id, user.id));
    await emailService.resetPasswordEmail(user.email, payload.passwordToken);
  });

  res.ok({ message: "Reset password email sent." });
}

export async function forgotPasswordConfirmation(req: Request, res: Response) {
  const { data, error } = validators.forgotPasswordConfirmationValidator(
    req.body
  );
  if (error) throw new BadRequest(error.message, error.code);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.passwordToken, data.token));

  if (!user) {
    throw new BadRequest("Invalid token", "INVALID_REQUEST_PARAMETERS");
  }

  res.ok({ message: "Password token confirmed." });
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const { data, error } = validators.resetPasswordValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.passwordToken, data.token),
  });

  if (!user) {
    throw new BadRequest("Invalid token", "INVALID_REQUEST_PARAMETERS");
  }

  const hash = await bcrypt.hash(data.password, 10);
  const payload = {
    password: hash,
    passwordToken: null,
    passwordTokenExpiresAt: null,
  };
  await db.update(users).set(payload).where(eq(users.id, user.id));

  res.ok({ message: "Password Updated" });
}

export async function changePasswordHandler(req: Request, res: Response) {
  const { uid } = req.user!;

  const { data, error } = validators.changePasswordValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const user = (await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, uid),
  }))!;

  if (!user.password) {
    throw new Forbidden("User has no set password", "ACCESS_DENIED");
  }

  const match = await bcrypt.compare(data.oldPassword, user.password);
  if (!match)
    throw new BadRequest("Invalid password", "INVALID_REQUEST_PARAMETERS");

  const hash = await bcrypt.hash(data.newPassword, 10);
  await db.update(users).set({ password: hash }).where(eq(users.id, user.id));

  res.ok({ message: "Password changed successfully." });
}

export async function googleOauthUrlHandler(req: Request, res: Response) {
  // Generate the url that will be used for the consent dialog.
  const authorizationUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
  });

  res.ok({ authorizationUrl });
}

export async function googleOauth(req: Request, res: Response) {
  const { data, error } = validators.googleOauthValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const token = await googleClient.getToken(data.code);
  const ticket = await googleClient.verifyIdToken({
    idToken: token.tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { sub, given_name, family_name, email } = ticket.getPayload()!;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, email!),
    with: {
      socialAccounts: {
        where: (table, { eq }) => eq(table.provider, "google"),
      },
    },
  });

  let user: any = existingUser;

  if (!existingUser) {
    await db.insert(users).values({
      email: email!,
      firstName: given_name,
      lastName: family_name,
      verified: true,
    });

    user = await db.query.users.findFirst({ where: eq(users.email, email!) });

    await db.insert(userSocialAccounts).values({
      provider: "google",
      socialLoginId: sub,
      userId: user.id,
    });
  } else if (!existingUser.socialAccounts[0]) {
    await db.insert(userSocialAccounts).values({
      provider: "google",
      socialLoginId: sub,
      userId: existingUser.id,
    });
  }

  res.setHeader("X-API-TOKEN", createLoginToken({ id: user.id }));

  res.ok({ user: _.pick(user, ["id", "firstName", "lastName", "email"]) });
}
