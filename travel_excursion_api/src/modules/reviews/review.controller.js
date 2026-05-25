const { createReview, getPackageReviews } = require("./review.service");
const { createReviewSchema } = require("./review.validation");

const createReviewController = async (req, res, next) => {
  try {
    const validated = createReviewSchema.parse(req.body);

    const review = await createReview({
      userId: req.user.id,
      ...validated,
    });

    res.status(201).json({
      success: true,
      message: "Package review created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getPackageReviewsController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await getPackageReviews(id);

    res.status(200).json({
      success: true,
      message: "Package reviews fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReviewController,
  getPackageReviewsController,
};
