const prisma = require("../../config/prisma");
const { sendBookingConfirmationEmail } = require("../../utils/email.utils");

const createBooking = async ({
  userId,
  packageId,
  participants,
  startDate,
}) => {

  const booking = await prisma.$transaction(async (tx) => {

    const package_ = await tx.package.findUnique({
      where: { id: packageId },
    });

    if (!package_) {
      const error = new Error("Package not found");
      error.status = 404;
      throw error;
    }

    if (package_.availableSeats < participants) {
      const error = new Error(
        `Not enough seats available. Only ${package_.availableSeats} seat(s) left.`,
      );
      error.status = 409;
      throw error;
    }

    const totalPrice = package_.price * participants;

    await tx.package.update({
      where: { id: packageId },
      data: {
        availableSeats: {
          decrement: participants, 
        },
      },
    });

    const newBooking = await tx.booking.create({
      data: {
        userId,
        packageId,
        participants,
        totalPrice,
        startDate,
        status: "PENDING",
      },
      include: {
        package: {
          select: {
            title: true,
            price: true,
            duration: true,
            schedule: true,
            excursion: {
              select: {
                title: true,
                destination: {
                  select: { title: true, country: true },
                },
              },
            },
          },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });

    return newBooking;
  });

  await sendBookingConfirmationEmail(booking.user.email, booking);

  return booking;
};

const getUserBookings = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      package: {
        select: {
          title: true,
          price: true,
          duration: true,
          schedule: true,
          excursion: {
            select: {
              title: true,
              category: true,
              destination: {
                select: { title: true, country: true },
              },
            },
          },
        },
      },
    },
  });

  return bookings;
};

const cancelBooking = async (bookingId, userId) => {
  await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      const error = new Error("Booking not found");
      error.status = 404;
      throw error;
    }

    if (booking.userId !== userId) {
      const error = new Error("You can only cancel your own bookings");
      error.status = 403;
      throw error;
    }

    if (booking.status === "CANCELLED") {
      const error = new Error("Booking is already cancelled");
      error.status = 400;
      throw error;
    }

    await tx.package.update({
      where: { id: booking.packageId },
      data: {
        availableSeats: {
          increment: booking.participants,
        },
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  });
};

module.exports = { createBooking, getUserBookings, cancelBooking };
