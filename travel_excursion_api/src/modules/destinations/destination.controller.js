const {
  createDestination,
  updateDestination,
  deleteDestination,
} = require("./destination.service");
const fs = require("fs");
const {
  createDestinationSchema,
  updateDestinationSchema,
} = require("./destination.validation");


const createDestinationController = async (req, res, next) => {
  try {
    const validated = createDestinationSchema.parse(req.body);

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const destination = await createDestination({ ...validated, images });

    res.status(201).json({
      success: true,
      message: "Destination created successfully",
      data: destination,
    });
  } catch (error) {
    // Cleanup uploaded files if validation failed
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      });
    } 
    next(error); 
  }
};


const updateDestinationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = updateDestinationSchema.parse(req.body);

    // Get new image paths if uploaded
    const images =
      req.files && req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : null;

    const destination = await updateDestination(id, { ...validated, images });

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDestinationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteDestination(id);

    res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDestinationController,
  updateDestinationController,
  deleteDestinationController,
};
