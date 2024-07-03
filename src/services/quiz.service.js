import prisma from "../lib/prisma.js";

const getAllQuizzes = async (simulationId) => {
  return await prisma.quiz.findFirstOrThrow({
    where: {
      simulationId,
    },
    include: {
      questions: {
        include: {
          quizOptions: true,
        },
      },
    },
  });
};

const getOneQuiz = async (quizId) => {
  return await prisma.quiz.findFirstOrThrow({
    where: {
      id: quizId,
    },
  });
};

const create = async (data) => {
  return await prisma.quiz.create({
    data,
  });
};

const update = async (id, data) => {
  return await prisma.quiz.update({
    data,
    where: {
      id,
    },
  });
};

const remove = async (data) => {
  return await prisma.quiz.delete({
    where: {
      id,
    },
  });
};

export default {
  getAllQuizzes,
  getOneQuiz,
  create,
  update,
  remove,
};
