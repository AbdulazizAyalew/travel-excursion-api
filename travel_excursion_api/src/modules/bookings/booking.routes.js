const express = require("express");
const {
  createBookingController,
  getUserBookingsController,
  cancelBookingController,
} = require("./booking.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageId
 *               - participants
 *               - startDate
 *             properties:
 *               packageId:
 *                 type: string
 *                 example: uuid-here
 *               participants:
 *                 type: integer
 *                 example: 2
 *               startDate:
 *                 type: string
 *                 example: "2026-06-10"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Package not found
 *       409:
 *         description: Not enough seats available
 */
router.post("/", authenticate, createBookingController);

/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     summary: Get current user bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, getUserBookingsController);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Already cancelled
 *       403:
 *         description: Not your booking
 *       404:
 *         description: Booking not found
 */
router.patch("/:id/cancel", authenticate, cancelBookingController);

module.exports = router;
