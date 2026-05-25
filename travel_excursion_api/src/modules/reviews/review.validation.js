const { z } = require("zod");

const createReviewSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),

  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),

  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(1000, "Comment must not exceed 1000 characters"),
});

module.exports = { createReviewSchema };
