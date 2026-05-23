const prisma = require("../../config/prisma");

const createExcursion = async ({
  destinationId,
  title,
  description,
  category,
  images,
}) => {
  // Check destination exists
  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });

  if (!destination) {
    const error = new Error("Destination not found");
    error.status = 404;
    throw error;
  }

  const excursion = await prisma.excursion.create({
    data: { destinationId, title, description, category, images },
  });

  return excursion;
};

const getExcursionById = async (id) => {
  const excursion = await prisma.excursion.findUnique({
    where: { id },
    include: {
      destination: {
        select: { id: true, title: true, country: true },
      },
      packages: true, 
    },
  });

  if (!excursion) {
    const error = new Error("Excursion not found");
    error.status = 404;
    throw error;
  }

  return excursion;
};

const updateExcursion = async (
  id,
  { title, description, category, images },
) => {
  const existing = await prisma.excursion.findUnique({ where: { id } });

  if (!existing) {
    const error = new Error("Excursion not found");
    error.status = 404;
    throw error;
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;

  // Append new images to existing
  if (images && images.length > 0) {
    updateData.images = [...existing.images, ...images];
  }

  const updated = await prisma.excursion.update({
    where: { id },
    data: updateData,
  });

  return updated;
};

const deleteExcursion = async (id) => {
  const existing = await prisma.excursion.findUnique({ where: { id } });

  if (!existing) {
    const error = new Error("Excursion not found");
    error.status = 404;
    throw error;
  }

  await prisma.excursion.delete({ where: { id } });
};

module.exports = {
  createExcursion,
  getExcursionById,
  updateExcursion,
  deleteExcursion,
};
