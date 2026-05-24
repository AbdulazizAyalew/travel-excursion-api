const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require("./booking.service");

const { createBookingSchema } = require("./booking.validation");

const createBookingController = async (req, res, next) => {
  try {
    const validated = createBookingSchema.parse(req.body);
    const booking = await createBooking({
      userId: req.user.id, 
      ...validated,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

const getUserBookingsController = async (req, res, next) => {
  try {
    const bookings = await getUserBookings(req.user.id);

    if (bookings.length !== 0) {
      res.status(200).json({
        success: true,
        message: "Bookings fetched successfully",
        data: bookings,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "No bookings found",
        data: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

const cancelBookingController = async (req, res, next) => {
  try {
    const { id } = req.params;
    await cancelBooking(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBookingController,
  getUserBookingsController,
  cancelBookingController,
};
