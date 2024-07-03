import prisma from "../lib/prisma.js";
import generateSlug from "../utils/generateSlug.js";

const getAlls = async () => {
  const chapters = await prisma.chapter.findMany();

  return chapters;
};

const create = async (data) => {
  const { name } = data;
  const slug = generateSlug(name);

  const chapter = await prisma.chapter.create({
    data: {
      name,
      slug,
    },
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
  const { name } = data;
  const slug = generateSlug(name);

  const chapter = await prisma.chapter.update({
    where: {
      id: chapterId,
    },
    data: {
      name,
      slug,
    },
  });

  return chapter;
};

const remove = async (chapterId) => {
  return await prisma.chapter.delete({
    where: {
      id: chapterId,
    },
  });
};

export default {
  getAlls,
  getOne,
  create,
  update,
  remove,
};
