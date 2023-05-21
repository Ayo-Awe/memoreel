import { z } from "zod";

import { validateAndFormat } from "../utils/errorHelpers";

export const editProfileValidator = function (payload: any) {
  const schema = z
    .object({
      firstName: z
        .string({
          invalid_type_error: "first name must be a string",
          required_error: "first name is required",
        })
        .nonempty()
        .optional(),
      lastName: z
        .string({
          invalid_type_error: "last name must be a string",
          required_error: "last name is required",
        })
        .nonempty()
        .optional(),
    })
    .refine(({ firstName, lastName }) => firstName || lastName, {
      message: "At least one of firstName or lastName is required.",
    });
  return validateAndFormat(schema, payload);
};
