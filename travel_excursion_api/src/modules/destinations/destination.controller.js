const {
  createDestination,
  updateDestination,
  deleteDestination,
  getAllDestinations,
  getDestinationById,
} = require("./destination.service");

const fs = require("fs");
const {
  createDestinationSchema,
  updateDestinationSchema,
} = require("./destination.validation");
const { success } = require("zod");


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


const getAllDestinationsController = async (req, res, next) => {
  try {
    const { search, country, sortBy, page, limit } = req.query;

    const result = await getAllDestinations({
      search,
      country,
      sortBy,
      page,
      limit,
    });
    console.log(result.destinations);

    if (result.destinations.length != 0){
      res.status(200).json({
        success: true,
        message: "Destinations fetched successfully",
        data: result.destinations,
        pagination: result.pagination,
      });
  }
  else {
    res.status(200).json(
      {
        message : "No result Found",
      }
    )
  }
  } catch (error) {
    next(error);
  }
};

const getDestinationByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destination = await getDestinationById(id);

    res.status(200).json({
      success: true,
      message: "Destination fetched successfully",
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDestinationController,
  updateDestinationController,
  deleteDestinationController,
  getAllDestinationsController,
  getDestinationByIdController,
};
