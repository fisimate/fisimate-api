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

export default {
  getAllSimulations,
  getOneSimulation,
};
