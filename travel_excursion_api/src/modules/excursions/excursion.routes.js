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
 *     summary: Get a single excursion with packages
 *     tags: [Excursions]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Excursion ID
 *     responses:
 *       200:
 *         description: Excursion fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Excursion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
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
router.get("/:id", getExcursionByIdController);

/**
 * @swagger
 * /api/excursions:
 *   post:
 *     summary: Create an excursion
 *     description: Admin only. Supports uploading up to 5 images.
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
 *                 example: "destination-uuid-here"
 *               title:
 *                 type: string
 *                 example: "Lake Tana Boat Tour"
 *               description:
 *                 type: string
 *                 example: "A guided boat tour around Lake Tana monasteries."
 *               category:
 *                 type: string
 *                 enum:
 *                   - ADVENTURE
 *                   - CULTURAL
 *                   - BEACH
 *                   - WILDLIFE
 *                   - HISTORICAL
 *                   - RELIGIOUS
 *                   - NATURE
 *                   - FOOD_AND_CUISINE
 *                   - CITY_TOUR
 *                 example: "CULTURAL"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Excursion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Destination not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
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
 *     summary: Update an excursion
 *     description: Admin only. Supports appending uploaded images.
 *     tags: [Excursions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Excursion ID
 *     requestBody:
 *       required: false
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
 *                 enum:
 *                   - ADVENTURE
 *                   - CULTURAL
 *                   - BEACH
 *                   - WILDLIFE
 *                   - HISTORICAL
 *                   - RELIGIOUS
 *                   - NATURE
 *                   - FOOD_AND_CUISINE
 *                   - CITY_TOUR
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Excursion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Excursion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
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
 *     summary: Delete an excursion
 *     description: Admin only.
 *     tags: [Excursions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Excursion ID
 *     responses:
 *       200:
 *         description: Excursion deleted successfully
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
 *         description: Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Excursion not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
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
router.delete("/:id", authenticate, authorizeAdmin, deleteExcursionController);

module.exports = router;
