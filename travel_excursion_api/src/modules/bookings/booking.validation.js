const { z } = require("zod");

const createBookingSchema = z.object({
  packageId: z.string().uuid("Invalid package ID"),

  participants: z.coerce
    .number()
    .int("Participants must be an integer")
    .positive("Participants must be a positive number"),

  startDate: z.coerce
  .date()
  .refine((date) => date > new Date(), {
    message: "Start date must be in the future",
  }),
});

module.exports = { createBookingSchema };
