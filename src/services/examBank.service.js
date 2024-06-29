import prisma from "../lib/prisma.js";

const getOneExamBank = async (id) => {
  const examBank = await prisma.examBank.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      chapter: true,
    },
  });

  return examBank;
};

const getExamBanks = async () => {
  const [totalChapters, totalSubChapters, examBanks] = await Promise.all([
    prisma.chapter.count(),
    prisma.examBank.count(),
    prisma.chapter.findMany({
      include: {
        examBanks: true,
      },
    }),
  ]);

  return {
    count: {
      chapters: totalChapters,
      sub_chapters: totalSubChapters,
    },
    result: examBanks,
  };
};

const create = async (data) => {
  const examBank = await prisma.examBank.create({
    data,
  });

  return examBank;
};

const update = async (id, data) => {
  const examBank = await prisma.examBank.update({
    data,
    where: {
      id,
    },
  });

  return examBank;
};

const remove = async (id) => {
  return await prisma.examBank.delete({
    where: {
      id,
    },
  });
};

export default {
  getOneExamBank,
  getExamBanks,
  create,
  update,
  remove,
};
