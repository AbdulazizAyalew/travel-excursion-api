const express = require("express");
const {
  createReviewController,
} = require("./review.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Package reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a package review
 *     description: Authenticated users can review a package only through their own confirmed booking. One review is allowed per booking.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - rating
 *               - comment
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "booking-uuid-here"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "The package was well organized and worth the price."
 *     responses:
 *       201:
 *         description: Package review created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User does not own the booking or booking is not confirmed
 *       404:
 *         description: Booking not found
 *       409:
 *         description: This booking has already been reviewed
 */
router.post("/", authenticate, createReviewController);


module.exports = router;
