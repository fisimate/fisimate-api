import prisma from "../lib/prisma.js";

const getAll = async () => {
  return await prisma.quizAttempt.findMany();
};

const getOne = async (id) => {
  return await prisma.quizAttempt.findUniqueOrThrow({
    where: {
      id,
    },
  });
};

const create = async (data) => {
  return await prisma.quizAttempt.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.quizAttempt.update({
    data,
    where: {
      id,
    },
  });
};

const remove = async (id) => {
  return await prisma.quizAttempt.delete({
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
