import prisma from "../lib/prisma.js";

const getMaterial = async (simulationId) => {
  return await prisma.material.findFirstOrThrow({
    where: {
      simulationId,
    },
  });
};

export default {
  getMaterial,
};
