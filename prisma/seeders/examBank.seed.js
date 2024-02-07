import configs from "../../src/configs/index.js";
import prisma from "../../src/lib/prisma.js";

const examBankSeed = async (chapters) => {
  const examBanks = [
    {
      title: "Mechanics Quiz 1",
      icon: `${configs.appUrl}/storage/icons/quiz.png`,
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      chapterId: chapters[0].id,
    },
    {
      title: "Mechanics Quiz 2",
      icon: `${configs.appUrl}/storage/icons/quiz.png`,
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      chapterId: chapters[0].id,
    },
    {
      title: "Rotational Dynamics Test",
      icon: `${configs.appUrl}/storage/icons/test.png`,
      filePath: `${configs.appUrl}/storage/files/file.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Test 2",
      icon: `${configs.appUrl}/storage/icons/test.png`,
      filePath: `${configs.appUrl}/storage/files/file.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Rotational Dynamics Test 3",
      icon: `${configs.appUrl}/storage/icons/test.png`,
      filePath: `${configs.appUrl}/storage/files/file.pdf`,
      chapterId: chapters[1].id,
    },
    {
      title: "Fluid Mechanics Practice",
      icon: `${configs.appUrl}/storage/icons/practice.png`,
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      chapterId: chapters[2].id,
    },
    {
      title: "Fluid Mechanics Practice 2",
      icon: `${configs.appUrl}/storage/icons/practice.png`,
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      chapterId: chapters[2].id,
    },
    {
      title: "Fluid Mechanics Practice 3",
      icon: `${configs.appUrl}/storage/icons/practice.png`,
      filePath: `${configs.appUrl}/storage/files/soal.pdf`,
      chapterId: chapters[2].id,
    },
  ];
  await prisma.examBank.createMany({
    data: examBanks,
  });
};

export default examBankSeed;
