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

export default {
  getAllQuizzes,
  getOneQuiz,
};
