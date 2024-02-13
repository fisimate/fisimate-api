import configs from "../../src/configs/index.js";
import prisma from "../../src/lib/prisma.js";

const materialSeed = async (simulations) => {
  const materials = [
    {
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      simulationId: simulations[0].id,
    },
    {
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      simulationId: simulations[1].id,
    },
    {
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      simulationId: simulations[2].id,
    },
  ];

  await prisma.material.createMany({
    data: materials,
  });
};

export default materialSeed;
