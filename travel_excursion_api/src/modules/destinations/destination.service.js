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

};

const deleteDestination = async (id) => {
  const existing = await prisma.destination.findUnique({ where: { id } });

  if (!existing) {
    const error = new Error("Destination not found");
    error.status = 404;
    throw error;
  }

  await prisma.destination.delete({ where: { id } });
};


const getAllDestinations = async ({ search, country, sortBy, page, limit }) => {
  
  const where = {};

  // Search by title OR description
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Filter by country
  if (country) {
    where.country = { equals: country, mode: "insensitive" };
  }


  const orderBy = {};
  if (sortBy === "newest") {
    orderBy.createdAt = "desc";
  } else if (sortBy === "oldest") {
    orderBy.createdAt = "asc";
  } else if (sortBy === "title_asc") {
    orderBy.title = "asc";
  } else if (sortBy === "title_desc") {
    orderBy.title = "desc";
  } else {
    orderBy.createdAt = "desc"; // default → newest first
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  
  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.destination.count({ where }),
  ]);

  return {
    destinations,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

const getDestinationById = async (id) => {
  const destination = await prisma.destination.findUnique({
    where: { id },
    include: {
      excursions: true, // include all excursions
    },
  });

  if (!destination) {
    const error = new Error("Destination not found");
    error.status = 404;
    throw error;
  }

  return destination;
};

module.exports = {
  createDestination,
  updateDestination,
  deleteDestination,
  getAllDestinations,
  getDestinationById,
};

