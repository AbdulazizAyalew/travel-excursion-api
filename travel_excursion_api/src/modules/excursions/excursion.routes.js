const express = require("express");
const {
  createExcursionController,
  getExcursionByIdController,
  updateExcursionController,
  deleteExcursionController,
} = require("./excursion.controller");

const {
  authenticate,
  authorizeAdmin,
} = require("../../middlewares/auth.middleware");

const upload = require("../../middlewares/upload.middleware");
const { categories } = require("./excursion.validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Excursions
 *   description: Excursion management
 */


/**
 * @swagger
 * /api/excursions/{id}:
 *   get:
 *     summary: Get excursion detail with its packages
 *     tags: [Excursions]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Excursion fetched successfully
 *       404:
 *         description: Excursion not found
 */
router.get("/:id", getExcursionByIdController);

/**
 * @swagger
 * /api/excursions:
 *   post:
 *     summary: Create a new excursion (Admin only)
 *     tags: [Excursions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - destinationId
 *               - title
 *               - description
 *               - category
 *             properties:
 *               destinationId:
 *                 type: string
 *                 example: uuid-here
 *               title:
 *                 type: string
 *                 example: Simien Mountains Trek
 *               description:
 *                 type: string
 *                 example: A breathtaking trek through the Simien Mountains
 *               category:
 *                 type: string
 *                 enum: [ADVENTURE, CULTURAL, BEACH, WILDLIFE, HISTORICAL, RELIGIOUS, NATURE, FOOD_AND_CUISINE, CITY_TOUR]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Excursion created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admins only
 *       404:
 *         description: Destination not found
 */
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.array("images", 5),
  createExcursionController,
);

/**
 * @swagger
 * /api/excursions/{id}:
 *   put:
 *     summary: Update an excursion (Admin only)
 *     tags: [Excursions]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [ADVENTURE, CULTURAL, BEACH, WILDLIFE, HISTORICAL, RELIGIOUS, NATURE, FOOD_AND_CUISINE, CITY_TOUR]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Excursion updated successfully
 *       404:
 *         description: Excursion not found
 *       403:
 *         description: Admins only
 */
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.array("images", 5),
  updateExcursionController,
);

/**
 * @swagger
 * /api/excursions/{id}:
 *   delete:
 *     summary: Delete an excursion (Admin only)
 *     tags: [Excursions]
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
 *         description: Excursion deleted successfully
 *       404:
 *         description: Excursion not found
 *       403:
 *         description: Admins only
 */
router.delete("/:id", authenticate, authorizeAdmin, deleteExcursionController);

module.exports = router;
