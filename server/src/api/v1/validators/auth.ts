import { z } from "zod";

import { validateAndFormat } from "../utils/errorHelpers";

export const registerValidator = function (payload: any) {
  const schema = z.object({
    email: z
      .string({
        invalid_type_error: "email must be a string",
        required_error: "email is required",
      })
      .trim()
      .email("email must be a valid email"),
    password: z
      .string({
        invalid_type_error: "password must be a string",
        required_error: "password is required",
      })
      .min(8, "password must be a minimum of 8 characters"),
  });

  return validateAndFormat(schema, payload);
};

export const emailVerificationValidator = function (payload: any) {
  const schema = z.object({
    token: z.string({
      invalid_type_error: "token must be a string",
      required_error: "token is required",
    }),
  });

  return validateAndFormat(schema, payload);
};

export const resendVerificationEmailValidator = function (payload: any) {
  const schema = z.object({
    email: z
      .string({
        invalid_type_error: "email must be a string",
        required_error: "email is required",
      })
      .email("email must be a valid email address"),
  });

  return validateAndFormat(schema, payload);
};

export const loginValidator = function (payload: any) {
  const schema = z.object({
    email: z
      .string({
        invalid_type_error: "email must be a string",
        required_error: "email is required",
      })
      .email("email must be a valid email address"),
    password: z.string({
      invalid_type_error: "password must be a string",
      required_error: "password is required",
    }),
  });

  return validateAndFormat(schema, payload);
};

export const forgotPasswordValidator = function (payload: any) {
  const schema = z.object({
    email: z
      .string({
        invalid_type_error: "email must be a string",
        required_error: "email is required",
      })
      .email("email must be a valid email address"),
  });

  return validateAndFormat(schema, payload);
};

export const forgotPasswordConfirmationValidator = function (payload: any) {
  const schema = z.object({
    token: z.string({
      invalid_type_error: "token must be a string",
      required_error: "token is required",
    }),
  });

  return validateAndFormat(schema, payload);
};

export const resetPasswordValidator = function (payload: any) {
  const schema = z.object({
    token: z.string({
      invalid_type_error: "token must be a string",
      required_error: "token is required",
    }),

    password: z
      .string({
        invalid_type_error: "password must be a string",
        required_error: "password is required",
      })
      .min(8, "password must be a minimum of 8 characters"),
  });

  return validateAndFormat(schema, payload);
};

export const changePasswordValidator = function (payload: any) {
  const schema = z.object({
    oldPassword: z.string({
      invalid_type_error: "old password must be a string",
      required_error: "old password is required",
    }),

    newPassword: z
      .string({
        invalid_type_error: "new password must be a string",
        required_error: "new password is required",
      })
      .min(8, "password must be a minimum of 8 characters"),
  });

  return validateAndFormat(schema, payload);
};

export const googleOauthValidator = function (payload: any) {
  const schema = z.object({
    code: z
      .string({
        invalid_type_error: "code must be a string",
        required_error: "code is required",
      })
      .transform((v) => decodeURIComponent(v)),
  });

  return validateAndFormat(schema, payload);
};
