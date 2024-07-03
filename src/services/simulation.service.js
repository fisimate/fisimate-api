import NotFoundError from "../errors/notFound.js";
import prisma from "../lib/prisma.js";

const getAllSimulations = async (req) => {
  const { title, chapterId } = req?.query || {};

  const filterOptions = {};

  if (title) {
    filterOptions.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (chapterId) {
    filterOptions.chapterId = {
      equals: chapterId,
    };
  }

  const simulations = await prisma.simulation.findMany({
    include: {
      chapter: true,
    },
    where: filterOptions,
  });

  if (simulations.length === 0) {
    throw new NotFoundError("Data kosong");
  }

  return simulations;
};

const getOneSimulation = async (id) => {
  return await prisma.simulation.findFirstOrThrow({
    where: {
      id,
    },
  });
};

const create = async (data) => {
  return await prisma.simulation.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.simulation.update({
    data,
    where: {
      id,
    },
  });
};

const remove = async (id) => {
  return await prisma.simulation.delete({
    where: {
      id,
    },
  });
};

export default {
  getAllSimulations,
  getOneSimulation,
  create,
  update,
  remove,
};
