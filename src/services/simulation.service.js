import prisma from "../lib/prisma.js";

const getAllSimulations = async () => {
  return await prisma.simulation.findMany({
    include: {
      chapter: true,
    },
  });
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
