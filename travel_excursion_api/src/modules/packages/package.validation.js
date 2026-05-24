const { z } = require("zod");

const durationOptions = [
  "Half Day",
  "Full Day",
  "2 Days",
  "3 Days",
  "4 Days",
  "5 Days",
  "1 Week",
  "2 Weeks",
  "Custom",
];

const scheduleOptions = [
  "Daily",
  "Weekdays Only (Mon-Fri)",
  "Weekends Only (Sat-Sun)",
  "Every Monday",
  "Every Tuesday",
  "Every Wednesday",
  "Every Thursday",
  "Every Friday",
  "Every Saturday",
  "Every Sunday",
  "Weekly",
  "Bi-Weekly",
  "Monthly",
  "On Request",
];

const createPackageSchema = z.object({
  excursionId: z.string().uuid("Invalid excursion ID"),

  title: z.string().min(5, "Title must be at least 5 characters"),

  duration: z.enum(durationOptions, {
    errorMap: () => ({
      message: `Duration must be one of: ${durationOptions.join(", ")}`,
    }),
  }),

  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Price must be a positive number",
    })
    .transform((val) => parseFloat(val)),

  schedule: z.enum(scheduleOptions, {
    errorMap: () => ({
      message: `Schedule must be one of: ${scheduleOptions.join(", ")}`,
    }),
  }),

  availableSeats: z
    .string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "Available seats must be a positive number",
    })
    .transform((val) => parseInt(val)),
});


// To update Packages
const updatePackageSchema = z.object({
  title: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => val === undefined || val.length >= 5, {
      message: "Title must be at least 5 characters",
    }),

  duration: z
    .enum(durationOptions, {
      errorMap: () => ({
        message: `Duration must be one of: ${durationOptions.join(", ")}`,
      }),
    })
    .optional(),

  price: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) =>
        val === undefined || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      { message: "Price must be a positive number" },
    )
    .transform((val) => (val !== undefined ? parseFloat(val) : undefined)),

  schedule: z
    .enum(scheduleOptions, {
      errorMap: () => ({
        message: `Schedule must be one of: ${scheduleOptions.join(", ")}`,
      }),
    })
    .optional(),

  availableSeats: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) =>
        val === undefined || (!isNaN(parseInt(val)) && parseInt(val) > 0),
      { message: "Available seats must be a positive number" },
    )
    .transform((val) => (val !== undefined ? parseInt(val) : undefined)),
});

module.exports = {
  createPackageSchema,
  updatePackageSchema,
  durationOptions,
  scheduleOptions,
};