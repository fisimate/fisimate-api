import prisma from "../lib/prisma.js";

const getAll = async () => {
  return await prisma.quizReview.findMany();
};

const getOne = async (id) => {
  return await prisma.quizReview.findFirstOrThrow({
    where: {
      id,
    },
  });
};

const create = async (data) => {
  return await prisma.quizReview.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.quizReview.update({
    where: {
      id,
    },
    data,
  });
};

const remove = async (id) => {
  return await prisma.quizReview.delete({
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
