const { z } = require("zod");
const { isValidCountry } = require("../../utils/countries.utils");

const createDestinationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .refine(isValidCountry, {
      message: "Invalid country name — please use a valid country",
    }),
});


const updateDestinationSchema = z.object({
  title: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => val === undefined || val.length >= 5, {
      message: "Title must be at least 5 characters",
    }),

  description: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => val === undefined || val.length >= 10, {
      message: "Description must be at least 10 characters",
    }),

  country: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)) // empty string → undefined
    .refine((val) => val === undefined || isValidCountry(val), {
      message: "Invalid country name",
    }),
});
module.exports = { createDestinationSchema, updateDestinationSchema };
