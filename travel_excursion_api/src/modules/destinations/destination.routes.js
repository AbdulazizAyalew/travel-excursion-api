const express = require("express");
const {
  createDestinationController,
  updateDestinationController,
  deleteDestinationController,
} = require("./destination.controller");
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

module.exports = router;