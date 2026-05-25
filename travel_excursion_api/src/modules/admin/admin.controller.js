const { getTotalBookings, getTotalUsers, getMonthlyRevenue, getTopDestinations } = require("./admin.service");

const getTotalBookingsController = async (req, res, next) => {
  try {
    const result = await getTotalBookings();

    res.status(200).json({
      success: true,
      message: "Total bookings fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const getTotalUsersController = async (req, res, next) => {
  try {
    const result = await getTotalUsers();

    res.status(200).json({
      success: true,
      message: "Total users fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const getMonthlyRevenueController = async (req, res, next) => {
  try {
    const result = await getMonthlyRevenue();

    res.status(200).json({
      success: true,
      message: "Monthly revenue fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


const getTopDestinationsController = async (req, res, next) => {
  try {
    const result = await getTopDestinations();

    res.status(200).json({
      success: true,
      message: "Top destinations fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTotalBookingsController,
  getTotalUsersController,
  getMonthlyRevenueController,
  getTopDestinationsController,
};
