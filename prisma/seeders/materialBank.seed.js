import configs from "../../src/configs/index.js";
import prisma from "../../src/lib/prisma.js";

const materialBankSeed = async (chapters) => {
  const materialBanks = [
    {
      title: "Mechanics Material 1",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[0].id,
    },
    {
      title: "Mechanics Material 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[0].id,
    },
    {
      title: "Rotational Dynamics Material",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Material 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Material 3",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Fluid Mechanics Material",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[2].id,
    },
    {
      title: "Fluid Mechanics Material 2",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[2].id,
    },
    {
      title: "Fluid Mechanics Material 3",
      icon: `${configs.appUrl}/storage/icons/dummy.png`,
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      chapterId: chapters[2].id,
    },
  ];
  await prisma.materialBank.createMany({
    data: materialBanks,
  });
};

export default materialBankSeed;
