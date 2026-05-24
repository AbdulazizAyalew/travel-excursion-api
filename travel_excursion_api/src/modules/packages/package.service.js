const prisma = require("../../config/prisma");
const { durations } = require("./package.validation");

const createPackage = async ({
  excursionId,
  title,
  price,
  duration,
  schedule,
  availableSeats,
}) => {
  // Check excursion exists
  const excursion = await prisma.excursion.findUnique({
    where: { id: excursionId },
  });

  if (!excursion) {
    const error = new Error("Excursion not found");
    error.status = 404;
    throw error;
  }

  const package_ = await prisma.package.create({
    data: {
      excursionId,
      title,
      price,
      duration,
      schedule,
      availableSeats,
    },
  });

  return package_;
};


const getPackageById = async (id) => {
  const package_ = await prisma.package.findUnique({
    where: { id },
    include: {
      excursion: {
        select: {
          id: true,
          title: true,
          category: true,
          destination: {
            select: { id: true, title: true, country: true },
          },
        },
      },
    },
  });

  if (!package_) {
    const error = new Error("Package not found");
    error.status = 404;
    throw error;
  }

  return package_;
};

const updatePackage = async (
  id,
  { title, price, duration, schedule, availableSeats },
) => {
  const existing = await prisma.package.findUnique({ where: { id } });

  if (!existing) {
    const error = new Error("Package not found");
    error.status = 404;
    throw error;
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (price !== undefined) updateData.price = price;
  if (duration !== undefined) updateData.duration = duration;

  if (schedule !== undefined) updateData.schedule = schedule;
  if (availableSeats !== undefined) updateData.availableSeats = availableSeats;


  const updated = await prisma.package.update({
    where: { id },
    data: updateData,
  });

  return updated;
};

const deletePackage = async (id) => {
  const existing = await prisma.package.findUnique({ where: { id } });

  if (!existing) {
    const error = new Error("Package not found");
    error.status = 404;
    throw error;
  }

  await prisma.package.delete({ where: { id } });
};

module.exports = {
  createPackage,
  getPackageById,
  updatePackage,
  deletePackage,
};
