import configs from "../../src/configs/index.js";
import prisma from "../../src/lib/prisma.js";

const simulationSeed = async (chapters) => {
  const simulations = [
    {
      title: "Simulasi GLBB",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      chapterId: chapters[0].id,
    },
    {
      title: "Mechanics Quiz 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Test",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Test 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      chapterId: chapters[2].id,
    },
  ];

  await prisma.simulation.createMany({
    data: simulations,
  });

  return await prisma.simulation.findMany();
};

export default simulationSeed;
