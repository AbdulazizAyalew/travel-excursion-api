const { z } = require("zod");

const categories = [
  "ADVENTURE",
  "CULTURAL",
  "BEACH",
  "WILDLIFE",
  "HISTORICAL",
  "RELIGIOUS",
  "NATURE",
  "FOOD_AND_CUISINE",
  "CITY_TOUR",
];

const createExcursionSchema = z.object({
  destinationId: z.string().uuid("Invalid destination ID"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(categories, {
    errorMap: () => ({
      message: `Category must be one of: ${categories.join(", ")}`,
    }),
  }),
});

const updateExcursionSchema = z.object({
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

  category: z
    .enum(categories, {
      errorMap: () => ({
        message: `Category must be one of: ${categories.join(", ")}`,
      }),
    })
    .optional(),
});

module.exports = { createExcursionSchema, updateExcursionSchema, categories };
