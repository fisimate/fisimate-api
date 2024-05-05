import prisma from "../lib/prisma.js";

const getAllQuestions = async (quizId) => {
  return await prisma.question.findMany({
    where: {
      quizId,
    },
    include: {
      quizOptions: true,
    },
  });
};

const getOneQuestion = async (questionId) => {
  return await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
    },
    include: {
      quizOptions: true,
    },
  });
};

const createQuestion = async (quizId, data) => {
  // merge quizId to data

  return await prisma.question.create({
    data,
  });
};

const updateQuestion = async (questionId, data) => {
  return await prisma.question.update({
    where: {
      id: questionId,
    },
    data,
  });
};

const deleteQuestion = async (questionId) => {
  return await prisma.question.delete({
    where: {
      id: questionId,
    },
  });
};

export default {
  getAllQuestions,
  getOneQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
