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

const answer = async (questionId, quizOptionId) => {
  const checkAnswer = await prisma.quizOption.findFirst({
    where: {
      questionId,
      id: quizOptionId,
      isCorrect: true,
    },
    include: {
      question: {
        select: {
          quizId: true,
        },
      },
    },
  });

  if (checkAnswer) {
    // cek user sudah pernah mengisi kuis atau belum, calculate total semua kuis, jika benar skor += nilai per question
    await prisma.userQuizResponse.upsert({
      where: {
        quizId: checkAnswer.question.quizId,
      },
      update: {},
    });
  }
};

export default {
  getAllQuestions,
  getOneQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  answer,
};
