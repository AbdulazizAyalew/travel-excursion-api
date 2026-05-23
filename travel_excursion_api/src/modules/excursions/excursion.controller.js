const {
  createExcursion,
  getExcursionById,
  updateExcursion,
  deleteExcursion,
} = require("./excursion.service");

const {
  createExcursionSchema,
  updateExcursionSchema,
} = require("./excursion.validation");

const fs = require("fs");

const createExcursionController = async (req, res, next) => {
  try {
    const validated = createExcursionSchema.parse(req.body);
    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const excursion = await createExcursion({ ...validated, images });

    res.status(201).json({
      success: true,
      message: "Excursion created successfully",
      data: excursion,
    });
  } catch (error) {
    // delete the files uploaded if the excursion detail is not valid
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


const getExcursionByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const excursion = await getExcursionById(id);

    res.status(200).json({
      success: true,
      message: "Excursion fetched successfully",
      data: excursion,
    });
  } catch (error) {
    next(error);
  }
};

const updateExcursionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = updateExcursionSchema.parse(req.body);
    const images =
      req.files && req.files.length > 0
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

    const excursion = await updateExcursion(id, { ...validated, images });

    res.status(200).json({
      success: true,
      message: "Excursion updated successfully",
      data: excursion,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExcursionController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteExcursion(id);

    res.status(200).json({
      success: true,
      message: "Excursion deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExcursionController,
  getExcursionByIdController,
  updateExcursionController,
  deleteExcursionController,
};
