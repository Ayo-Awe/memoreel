import { z } from "zod";
import { validateAndFormat } from "../utils/errorHelpers";
import moment from "moment";
const MINIMUM_DAYS_TO_DELIVERY = 1;

export const createReelValidator = function (payload: any) {
  const schema = z.object({
    email: z
      .string({
        invalid_type_error: "email must be a string",
        required_error: "email is required",
      })
      .email("email must be a valid email address"),
    title: z
      .string({
        invalid_type_error: "title must be a string",
        required_error: "title is required",
      })
      .nonempty("title cannot be an empty string"),
    description: z
      .string({
        invalid_type_error: "description must be a string",
      })
      .optional(),
    deliveryDate: z
      .string({
        invalid_type_error: "date must be a string",
        required_error: "date is required",
      })
      .datetime("date must be a valid date string")
      .refine(
        (date) => moment(date).diff(moment(), "d") >= MINIMUM_DAYS_TO_DELIVERY,
        `delivery date must be at least ${MINIMUM_DAYS_TO_DELIVERY} day(s) away.`
      ),
  });

  return validateAndFormat(schema, payload);
};

export const reelConfirmationValidator = function (payload: any) {
  const schema = z.object({
    token: z.string({
      invalid_type_error: "token must be a string",
      required_error: "token is required",
    }),
  });

  return validateAndFormat(schema, payload);
};
