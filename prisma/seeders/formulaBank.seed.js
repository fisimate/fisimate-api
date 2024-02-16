import configs from "../../src/configs/index.js";
import prisma from "../../src/lib/prisma.js";

const formulaBankSeed = async (chapters) => {
  const formulaBanks = [
    {
      title: "Mechanics Quiz 1",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[0].id,
    },
    {
      title: "Mechanics Quiz 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[0].id,
    },
    {
      title: "Rotational Dynamics Test",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Test 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Test 3",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Fluid Mechanics Practice",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[2].id,
    },
    {
      title: "Fluid Mechanics Practice 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[2].id,
    },
    {
      title: "Fluid Mechanics Practice 3",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[2].id,
    },
  ];
  await prisma.formulaBank.createMany({
    data: formulaBanks,
  });
};

export default formulaBankSeed;
