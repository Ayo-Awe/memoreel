import crypto from "crypto";
import { and, eq, isNull, or, sql } from "drizzle-orm";
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
import * as userRepository from "../repositories/user";
import * as validators from "../validators/auth";
import * as bcrypt from "bcrypt";
import { googleClient } from "../../shared/config/googleOauth";

export async function registerHandler(req: Request, res: Response) {
  // Validate request body
  const { data, error } = validators.registerValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  // Check for existing users
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser)
    throw new Conflict(
      `User with email(${data.email}) already exists`,
      "EXISTING_USER_EMAIL"
    );
  // create verification token and send verification email
  const confirmationToken = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

  const confirmationTokenExpiresAt = moment().add(30, "minutes").toDate();

  await db.transaction(async (tx) => {
    // Create new user
    const user = await userRepository.create(
      {
        ...data,
        confirmationToken,
        confirmationTokenExpiresAt,
      },
      tx
    );

    await emailService.verificationEmail(user.email, confirmationToken);
  });

  res.created({ message: "Email verification sent" });
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const { data, error } = validators.emailVerificationValidator(req.body);

  if (error) throw new BadRequest(error.message, error.code);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.confirmationToken, data.token));

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
      await userRepository.update(
        user.id,
        {
          confirmationToken,
          confirmationTokenExpiresAt,
        },
        tx
      );

      await emailService.verificationEmail(user.email, confirmationToken);
    });

    throw new BadRequest(
      "Token Expired. New email has been sent",
      "INVALID_REQUEST_PARAMETERS"
    );
  }

  await userRepository.update(user.id, {
    verified: true,
    confirmationToken: null,
    confirmationTokenExpiresAt: null,
  });
  res.setHeader("X-API-TOKEN", createLoginToken({ id: user.id }));

  res.ok({ user: _.pick(user, ["id", "firstName", "lastName", "email"]) });
}

export async function resendVerificationEmail(req: Request, res: Response) {
  const { data, error } = validators.resendVerificationEmailValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

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
    .update(JSON.stringify(data))
    .digest("hex");

  const confirmationTokenExpiresAt = moment().add(30, "minutes").toDate();

  await db.transaction(async (tx) => {
    const payload = {
      confirmationToken,
      confirmationTokenExpiresAt,
    };
    await userRepository.update(user.id, payload, tx);
    await emailService.verificationEmail(user.email, confirmationToken);
  });

  res.ok({ message: "Verification email sent." });
}

export async function loginHandler(req: Request, res: Response) {
  const { data, error } = validators.loginValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (!user) {
    throw new ResourceNotFound(
      `User with email (${data.email}) not found`,
      "RESOURCE_NOT_FOUND"
    );
  }

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
      .update(JSON.stringify(data))
      .digest("hex");

    const confirmationTokenExpiresAt = moment().add(30, "minutes").toDate();

    await db.transaction(async (tx) => {
      const payload = {
        confirmationToken,
        confirmationTokenExpiresAt,
      };
      await userRepository.update(user.id, payload, tx);
      await emailService.verificationEmail(user.email, confirmationToken);
    });

    throw new Forbidden("Email is already confirmed", "USER_NOT_VERIFIED");
  }

  res.setHeader("X-API-TOKEN", createLoginToken({ id: user.id }));

  res.ok({ user: _.pick(user, ["id", "firstName", "lastName", "email"]) });
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const { data, error } = validators.forgotPasswordValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

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
      .update(JSON.stringify(moment()))
      .digest("hex"),
    passwordTokenExpiresAt: moment().add(25, "minutes").toDate(),
  };

  await db.transaction(async (tx) => {
    await userRepository.update(user.id, payload, tx);
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

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.passwordToken, data.token));

  if (!user) {
    throw new BadRequest("Invalid token", "INVALID_REQUEST_PARAMETERS");
  }

  const hash = await bcrypt.hash(data.password, 10);
  const payload = {
    password: hash,
    passwordToken: null,
    passwordTokenExpiresAt: null,
  };
  await userRepository.update(user.id, payload);

  res.ok({ message: "Password Updated" });
}

export async function changePasswordHandler(req: Request, res: Response) {
  const { uid } = req.user!;

  const { data, error } = validators.changePasswordValidator(req.body);
  if (error) throw new BadRequest(error.message, error.code);

  const [user] = await db.select().from(users).where(eq(users.id, uid));

  if (!user.password) {
    throw new Forbidden("User has no set password", "ACCESS_DENIED");
  }

  const match = await bcrypt.compare(data.oldPassword, user.password);
  if (!match)
    throw new BadRequest("Invalid password", "INVALID_REQUEST_PARAMETERS");

  const hash = await bcrypt.hash(data.newPassword, 10);
  await userRepository.update(user.id, { password: hash });

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

  const [existingUser] = await db
    .select()
    .from(users)
    .leftJoin(
      userSocialAccounts,
      and(
        eq(users.id, userSocialAccounts.userId),
        eq(userSocialAccounts.provider, "google")
      )
    )
    .where(eq(users.email, email!));
  let user = existingUser?.users;
  if (!existingUser) {
    user = await userRepository.create({
      email: email!,
      firstName: given_name,
      lastName: family_name,
      verified: true,
    });

    await db.insert(userSocialAccounts).values({
      provider: "google",
      socialLoginId: sub,
      userId: user.id,
    });
  } else if (!existingUser.user_social_accounts) {
    await db.insert(userSocialAccounts).values({
      provider: "google",
      socialLoginId: sub,
      userId: existingUser.users.id,
    });
  }

  res.setHeader("X-API-TOKEN", createLoginToken({ id: user.id }));

  res.ok({ user: _.pick(user, ["id", "firstName", "lastName", "email"]) });
}
