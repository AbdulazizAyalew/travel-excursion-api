const prisma = require("../../config/prisma");

const createReview = async ({ userId, bookingId, rating, comment }) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      review: true,
      package: {
        select: {
          id: true,
          title: true,
          price: true,
          duration: true,
          excursion: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!booking) {
    const error = new Error("Booking not found");
    error.status = 404;
    throw error;
  }

  if (booking.userId !== userId) {
    const error = new Error("You can only review your own booking");
    error.status = 403;
    throw error;
  }

  if (booking.status !== "CONFIRMED") {
    const error = new Error("You can only review a confirmed booking");
    error.status = 403;
    throw error;
  }

  if (booking.review) {
    const error = new Error("This booking has already been reviewed");
    error.status = 409;
    throw error;
  }

  try {
    const review = await prisma.review.create({
      data: {
        userId,
        bookingId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        booking: {
          select: {
            id: true,
            package: {
              select: {
                id: true,
                title: true,
                price: true,
                duration: true,
              },
            },
          },
        },
      },
    });

    return review;
  } catch (error) {
    if (error.code === "P2002") {
      const conflictError = new Error("This booking has already been reviewed");
      conflictError.status = 409;
      throw conflictError;
    }

    throw error;
  }
};

const getPackageReviews = async (packageId) => {
  const package_ = await prisma.package.findUnique({
    where: { id: packageId },
    select: {
      id: true,
      title: true,
      price: true,
      duration: true,
      schedule: true,
    },
  });

  if (!package_) {
    const error = new Error("Package not found");
    error.status = 404;
    throw error;
  }

  const reviews = await prisma.review.findMany({
    where: {
      booking: {
        packageId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      booking: {
        select: {
          id: true,
          participants: true,
          startDate: true,
        },
      },
    },
  });

  const ratingStats = await prisma.review.aggregate({
    where: {
      booking: {
        packageId,
      },
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  return {
    package: package_,
    averageRating: ratingStats._avg.rating
      ? Number(ratingStats._avg.rating.toFixed(1))
      : 0,
    totalReviews: ratingStats._count.rating,
    reviews,
  };
};

module.exports = {
  createReview,
  getPackageReviews,
};
