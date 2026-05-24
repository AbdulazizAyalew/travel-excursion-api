const {
  createPackage,
  getPackageById,
  updatePackage,
  deletePackage,
} = require("./package.service");

const {
  createPackageSchema,
  updatePackageSchema,
} = require("./package.validation");

const createPackageController = async (req, res, next) => {
  try {
    const validated = createPackageSchema.parse(req.body);
    const package_ = await createPackage(validated);

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      data: package_,
    });
  } catch (error) {
    next(error);
  }
};

const getPackageByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const package_ = await getPackageById(id);

    res.status(200).json({
      success: true,
      message: "Package fetched successfully",
      data: package_,
    });
  } catch (error) {
    next(error);
  }
};

const updatePackageController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = updatePackageSchema.parse(req.body);
    const package_ = await updatePackage(id, validated);

    res.status(200).json({
      success: true,
      message: "Package updated successfully",
      data: package_,
    });
  } catch (error) {
    next(error);
  }
};

const deletePackageController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deletePackage(id);

    res.status(200).json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPackageController,
  getPackageByIdController,
  updatePackageController,
  deletePackageController,
};
