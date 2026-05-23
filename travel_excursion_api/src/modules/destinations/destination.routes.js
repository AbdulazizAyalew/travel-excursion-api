const {
  createDestinationController,
  updateDestinationController,
  deleteDestinationController,
  getAllDestinationsController,
  getDestinationByIdController,
} = require("./destination.controller");

const express = require("express");

const {
  createDestinationSchema,
  updateDestinationSchema,
} = require("./destination.validation");
const {
  authenticate,
  authorizeAdmin,
} = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Admin destination management
 */

/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Create a new destination (Admin only)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - country
 *             properties:
 *               title:
 *                 type: string
 *                 example: Ethiopia
 *               description:
 *                 type: string
 *                 example: Ethiopia | The Land of origins
 *               country:
 *                 type: string
 *                 example: Ethiopia
 *                 description: Must be a valid country name (e.g. Ethiopia, Greece, France)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Destination created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admins only
 */

router.post(
  "/",
  authenticate, 
  authorizeAdmin, 
  upload.array("images", 5), 
  createDestinationController, 
);


/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Update a destination (Admin only)
 *     tags: [Destinations]
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
 *               country:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Destination updated successfully
 *       404:
 *         description: Destination not found
 *       403:
 *         description: Admins only
*/

router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.array("images", 5),
  updateDestinationController,
);
/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Delete a destination (Admin only)
 *     tags: [Destinations]
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
 *         description: Destination deleted successfully
 *       404:
 *         description: Destination not found
 *       403:
 *         description: Admins only
 */
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  deleteDestinationController,
);



/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Get all destinations with search, filter and pagination
 *     tags: [Destinations]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *         example: Bahirdar
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *         example: Ethiopia
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, oldest, title_asc, title_desc]
 *         description: Sort results
 *         example: newest
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Destinations fetched successfully
 */
router.get("/", getAllDestinationsController);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Get a single destination with its excursions
 *     tags: [Destinations]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination ID
 *     responses:
 *       200:
 *         description: Destination fetched successfully
 *       404:
 *         description: Destination not found
 */
router.get("/:id", getDestinationByIdController);

module.exports = router;