import configs from "../../src/configs/index.js";
import prisma from "../../src/lib/prisma.js";

const quizSeed = async (simulations) => {
  const quizzes = [
    // quiz simulation 0
    {
      simulationId: simulations[0].id,
    },

    // quiz simulation 1
    {
      simulationId: simulations[1].id,
    },

    // quiz simulation 2
    {
      simulationId: simulations[2].id,
    },

    // quiz simulation 3
    {
      simulationId: simulations[3].id,
    },
  ];

  await prisma.quiz.createMany({
    data: quizzes,
  });

  const createdQuiz = await prisma.quiz.findMany();

  const questions = [
    // question 0
    {
      text: "Berikut ini mana pernyataan yang benar...",
      quizId: createdQuiz[0].id,
    },

    // question 1
    {
      text: "Berikut ini mana pernyataan yang salah...",
      quizId: createdQuiz[0].id,
    },

    // question 2
    {
      text: "Berikut ini mana pernyataan yang tidak benar...",
      quizId: createdQuiz[0].id,
    },

    // question 3
    {
      text: "Berikut ini mana pernyataan yang tidak salah...",
      quizId: createdQuiz[0].id,
    },
  ];

  await prisma.question.createMany({
    data: questions,
  });

  const createdQuestion = await prisma.question.findMany();

  const options = [
    // question 0
    {
      questionId: createdQuestion[0].id,
      text: "Memancing",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[0].id,
      text: "Mencari Judul",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[0].id,
      text: "Belajar Fisika",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[0].id,
      text: "Hilang kesadaran",
      isCorrect: true,
    },

    // question 1
    {
      questionId: createdQuestion[1].id,
      text: "Memancing",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[1].id,
      text: "Mencari Judul",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[1].id,
      text: "Belajar Fisika",
      isCorrect: true,
    },
    {
      questionId: createdQuestion[1].id,
      text: "Hilang kesadaran",
      isCorrect: false,
    },

    // question 2
    {
      questionId: createdQuestion[2].id,
      text: "Memancing",
      isCorrect: true,
    },
    {
      questionId: createdQuestion[2].id,
      text: "Mencari Judul",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[2].id,
      text: "Belajar Fisika",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[2].id,
      text: "Hilang kesadaran",
      isCorrect: false,
    },

    // question 3
    {
      questionId: createdQuestion[3].id,
      text: "Memancing",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[3].id,
      text: "Mencari Judul",
      isCorrect: true,
    },
    {
      questionId: createdQuestion[3].id,
      text: "Belajar Fisika",
      isCorrect: false,
    },
    {
      questionId: createdQuestion[3].id,
      text: "Hilang kesadaran",
      isCorrect: false,
    },
  ];

  await prisma.quizOption.createMany({
    data: options,
  });

  const reviews = [
    // review quiz 0
    {
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      quizId: createdQuiz[0].id,
    },

    // review quiz 1
    {
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      quizId: createdQuiz[0].id,
    },

    // review quiz 2
    {
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      quizId: createdQuiz[0].id,
    },

    // review quiz 3
    {
      filePath: `${configs.appUrl}/storage/files/template.pdf`,
      quizId: createdQuiz[0].id,
    },
  ];

  await prisma.quizReview.createMany({
    data: reviews,
  });
};

export default quizSeed;
