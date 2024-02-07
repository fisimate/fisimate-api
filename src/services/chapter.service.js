import prisma from "../lib/prisma.js";

const getAlls = async () => {
  const chapters = await prisma.chapter.findMany();

  return chapters;
};

const create = async (data) => {
  const chapter = await prisma.chapter.create({
    data,
  });

  return chapter;
};

const getOne = async (chapterId) => {
  const chapter = await prisma.chapter.findFirstOrThrow({
    where: {
      id: chapterId,
    },
  });

  return chapter;
};

const update = async (chapterId, data) => {
  const chapter = await prisma.chapter.update({
    where: {
      id: chapterId,
    },
    data,
  });

  return chapter;
};

const remove = async (chapterId) => {
  const chapter = await prisma.chapter.delete({
    where: {
      di: chapterId,
    },
  });

  return;
};

const getExambanks = async () => {
  const examBanks = await prisma.chapter.findMany({
    include: {
      examBanks: true,
    },
  });

  return examBanks;
};

export default {
  getAlls,
  getOne,
  create,
  update,
  remove,
  getExambanks,
};
