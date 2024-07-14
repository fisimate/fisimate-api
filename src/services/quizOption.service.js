import prisma from "../lib/prisma.js";

const getAll = async () => {
  return await prisma.quizOption.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
};

const getOne = async (id) => {
  return await prisma.quizOption.findFirstOrThrow({
    where: {
      id,
    },
  });
};

const create = async (data) => {
  return await prisma.quizOption.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.quizOption.update({
    where: {
      id,
    },
    data,
  });
};

const remove = async (id) => {
  return await prisma.quizOption.delete({
    where: {
      id,
    },
  });
};

export default {
  getAll,
  getOne,
  create,
  update,
  remove,
};
