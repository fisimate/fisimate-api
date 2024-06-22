import configs from "../../src/configs/index.js";
import prisma from "../../src/lib/prisma.js";

const quizSeed = async (simulations, createdUsers) => {
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
  const createdQuizOptions = await prisma.quizOption.findMany();
  const userId = createdUsers[0].id; // Assuming you're using the first user

  const quizAttempts = [
    {
      quizId: createdQuiz[0].id,
      userId: userId,
      score: 100,
      attemptAt: new Date(),
    },
  ];

  await prisma.quizAttempt.createMany({
    data: quizAttempts,
  });

  const createdQuizAttempts = await prisma.quizAttempt.findMany();

  const userQuizResponses = [
    {
      quizAttemptId: createdQuizAttempts[0].id,
      questionId: createdQuestion[0].id,
      selectedOptionId: createdQuizOptions[3].id, // Correct option for question 0
    },
    {
      quizAttemptId: createdQuizAttempts[0].id,
      questionId: createdQuestion[1].id,
      selectedOptionId: createdQuizOptions[6].id, // Correct option for question 1
    },
    {
      quizAttemptId: createdQuizAttempts[0].id,
      questionId: createdQuestion[2].id,
      selectedOptionId: createdQuizOptions[8].id, // Correct option for question 2
    },
    {
      quizAttemptId: createdQuizAttempts[0].id,
      questionId: createdQuestion[3].id,
      selectedOptionId: createdQuizOptions[11].id, // Correct option for question 3
    },
  ];

  await prisma.userQuizResponse.createMany({
    data: userQuizResponses,
  });
};

export default quizSeed;
