import { z } from "zod";

import { validateAndFormat } from "../utils/errorHelpers";
import moment from "moment";
const MINIMUM_DAYS_TO_DELIVERY = 1;

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

export const createReelValidator = function (payload: any) {
  const schema = z.object({
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
