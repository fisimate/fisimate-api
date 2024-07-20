import prisma from "../lib/prisma.js";

const getMaterial = async (simulationId) => {
  return await prisma.material.findFirst({
    where: {
      simulationId,
    },
    include: {
      simulation: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

const getOne = async (id) => {
  return await prisma.material.findFirst({
    where: {
      id,
    },
  });
};

const create = async (data) => {
  return await prisma.material.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.material.update({
    where: {
      id,
    },
    data,
  });
};

const remove = async (id) => {
  return await prisma.material.delete({
    where: {
      id,
    },
  });
};

export default {
  getMaterial,
  getOne,
  create,
  update,
  remove,
};
