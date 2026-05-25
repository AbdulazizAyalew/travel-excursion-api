const express = require("express");
const { 
  getTotalBookingsController,
  getTotalUsersController,
  getMonthlyRevenueController,
  getTopDestinationsController, } = require("./admin.controller");
const {
  authenticate,
  authorizeAdmin,
} = require("../../middlewares/auth.middleware");

const router = express.Router();



/**
 * @swagger
 * tags:
 *   name: Admin Stats
 *   description: Admin dashboard analytics endpoints
 */

/**
 * @swagger
 * /api/admin/stats/bookings:
 *   get:
 *     summary: Get total bookings count
 *     description: Returns the total number of bookings in the system. Admin only.
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total bookings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
 
router.get(
  "/bookings",
  authenticate,
  authorizeAdmin,
  getTotalBookingsController,
);



/**
 * @swagger
 * /api/admin/stats/users:
 *   get:
 *     summary: Get total registered users count
 *     description: Returns the total number of registered users. Admin only.
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get(
  "/users",
  authenticate,
  authorizeAdmin,
  getTotalUsersController
);


/**
 * @swagger
 * /api/admin/stats/revenue:
 *   get:
 *     summary: Get monthly revenue
 *     description: Returns monthly revenue grouped by year and month using confirmed bookings only. Admin only.
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly revenue fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get(
  "/revenue",
  authenticate,
  authorizeAdmin,
  getMonthlyRevenueController
);


/**
 * @swagger
 * /api/admin/stats/top-destinations:
 *   get:
 *     summary: Get top destinations by booking count
 *     description: Returns the top 5 destinations sorted by confirmed booking count. Admin only.
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top destinations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateLimitResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
router.get(
  "/top-destinations",
  authenticate,
  authorizeAdmin,
  getTopDestinationsController
);
module.exports = router;
