const express = require("express");
const {
  createPackageController,
  getPackageByIdController,
  updatePackageController,
  deletePackageController,
} = require("./package.controller");
const {
  authenticate,
  authorizeAdmin,
} = require("../../middlewares/auth.middleware");

const {durations} = require("./package.validation")

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: Package management
 */

/**
 * @swagger
 * /api/packages/{id}:
 *   get:
 *     summary: Get a single package with excursion package details
 *     tags: [Packages]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Package fetched successfully
 *       404:
 *         description: Package not found
 */
router.get("/:id", getPackageByIdController);

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - excursionId
 *               - title
 *               - price
 *               - duration
 *               - schedule
 *               - availableSeats
 *             properties:
 *               excursionId:
 *                 type: string
 *                 example: uuid-here
 *               title:
 *                 type: string
 *                 example: Premium Safari Package
 *               price:
 *                 type: string
 *                 example: 299.99
 *               duration:
 *                 type: string
 *                 example: 3 days
 *               schedule:
 *                 type: string
 *                 example: Every Monday and Friday
 *               availableSeats:
 *                 type: string
 *                 example: 20
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admins only
 *       404:
 *         description: Excursion not found
 */
router.post("/", authenticate, authorizeAdmin, createPackageController);

/**
 * @swagger
 * /api/packages/{id}:
 *   put:
 *     summary: Update a package (Admin only)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: string
 *               duration:
 *                 type: string
 *               schedule:
 *                 type: string
 *               availableSeats:
 *                 type: string
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       404:
 *         description: Package not found
 *       403:
 *         description: Admins only
 */
router.put("/:id", authenticate, authorizeAdmin, updatePackageController);

/**
 * @swagger
 * /api/packages/{id}:
 *   delete:
 *     summary: Delete a package (Admin only)
 *     tags: [Packages]
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
 *         description: Package deleted successfully
 *       404:
 *         description: Package not found
 *       403:
 *         description: Admins only
 */
router.delete("/:id", authenticate, authorizeAdmin, deletePackageController);




module.exports = router;
