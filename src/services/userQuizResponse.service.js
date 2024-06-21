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

export default {
  getResponse,
};
