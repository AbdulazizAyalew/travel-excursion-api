const prisma = require("../../config/prisma");

const getTotalBookings = async () => {
  const totalBookings = await prisma.booking.count();

  return {
    totalBookings,
  };
};

const getTotalUsers = async () => {
  const totalUsers = await prisma.user.count();

  return {
    totalUsers,
  };
};



const getMonthlyRevenue = async () => {
  const revenue = await prisma.$queryRaw`
    SELECT
      EXTRACT(YEAR FROM "createdAt")::int AS year,
      EXTRACT(MONTH FROM "createdAt")::int AS month,
      SUM("totalPrice")::float AS revenue
    FROM "Booking"
    WHERE "status" = 'CONFIRMED'
    GROUP BY year, month
    ORDER BY year DESC, month DESC
  `;

  return revenue;
};



const getTopDestinations = async () => {
  const topDestinations = await prisma.$queryRaw`
    SELECT
      d."id" AS "destinationId",
      d."title" AS "title",
      d."country" AS "country",
      COUNT(b."id")::int AS "bookingCount"
    FROM "Booking" b
    JOIN "Package" p ON b."packageId" = p."id"
    JOIN "Excursion" e ON p."excursionId" = e."id"
    JOIN "Destination" d ON e."destinationId" = d."id"
    WHERE b."status" = 'CONFIRMED'
    GROUP BY d."id", d."title", d."country"
    ORDER BY "bookingCount" DESC
    LIMIT 5
  `;

  return topDestinations;
};
module.exports = {
  getTotalBookings,
  getTotalUsers,
  getMonthlyRevenue,
  getTopDestinations,
};
