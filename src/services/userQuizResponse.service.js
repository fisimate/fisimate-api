import prisma from "../lib/prisma.js";

const getResponse = async (userId, quizId) => {
  return await prisma.userQuizResponse.findFirstOrThrow({
    where: {
      user: userId,
      AND: {
        quizId: quizId,
      },
    },
  });
};

const getAll = async () => {
  return await prisma.userQuizResponse.findMany();
};

const getOne = async (id) => {
  return await prisma.userQuizResponse.findFirstOrThrow({
    where: {
      id,
    },
  });
};

const create = async (data) => {
  return await prisma.userQuizResponse.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.userQuizResponse.update({
    data,
    where: {
      id,
    },
  });
};

const remove = async (id) => {
  return await prisma.userQuizResponse.delete({
    where: {
      id,
    },
  });
};

export default {
  getResponse,
  getAll,
  getOne,
  create,
  update,
  remove,
};
