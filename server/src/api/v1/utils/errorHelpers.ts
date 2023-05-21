import { ZodSchema, ZodTypeDef } from "zod";

import { BadRequestErrorCode } from "../../../errors/httpErrorCodes";

export function validateAndFormat<T, U extends ZodTypeDef>(
  schema: ZodSchema<T, U, T>,
  payload: any
) {
  const result = schema.safeParse(payload);

  if (result.success) return { data: result.data };

  const { errors } = result.error;
  const code: BadRequestErrorCode = errors[0].message.includes("required")
    ? "MISSING_REQUIRED_FIELD"
    : "INVALID_REQUEST_PARAMETERS";

  return { error: { code, message: errors[0].message } };
}
