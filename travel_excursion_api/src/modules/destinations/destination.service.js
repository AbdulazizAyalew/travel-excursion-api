const prisma = require("../../config/prisma");

const createDestination = async ({ title, description, country, images }) => {
  const destination = await prisma.destination.create({
    data: {
      title,
      description,
      country,
      images, 
    },
  });
  return destination;
};

const updateDestination = async (id, { title, description, country, images }) => {
  
  const existing = await prisma.destination.findUnique({ where: { id } });

  if (!existing) {
    const error = new Error("Destination not found");
    error.status = 404;
    throw error;
  }

  const updateData = {};

  // Only add field if it was actually sent
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (country !== undefined) updateData.country = country;

  // If new images uploaded we need to append to the exisiting ones
  if (images && images.length > 0) {
    updateData.images = [
      ...existing.images, 
      ...images,
    ];
  }

  // Updating the DB with the updated data
  const updated = await prisma.destination.update({
    where: { id },
    data: updateData,
  });

  return updated;

};;

const deleteDestination = async (id) => {
  const existing = await prisma.destination.findUnique({ where: { id } });

  if (!existing) {
    const error = new Error("Destination not found");
    error.status = 404;
    throw error;
  }

  await prisma.destination.delete({ where: { id } });
};

module.exports = { createDestination, updateDestination, deleteDestination };
