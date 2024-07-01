import prisma from "../lib/prisma.js";
import apiSuccess from "../utils/apiSuccess.js";

// history berdasarkan user yang login
const getAllAttempts = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
      },
      include: {
        quiz: true,
        userQuizResponse: true,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", attempts);
  } catch (error) {
    next(error);
  }
};

const getAttemptByQuizId = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { quizId } = req.params;

    const attempt = await prisma.quizAttempt.findFirstOrThrow({
      where: {
        quizId,
        AND: {
          userId,
        },
      },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                quizOptions: true,
              },
            },
          },
        },
        userQuizResponse: true,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", attempt);
  } catch (error) {
    next(error);
  }
};

// Create attempt
const createAttempt = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { quizId, responses } = req.body;

    // Step 1: Create a new quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        score: 0, // Initial score is 0, will be updated after evaluating responses
        attemptAt: new Date(),
      },
    });

    const attemptId = quizAttempt.id;

    // Save user responses
    const responsePromises = responses.map(async (response) => {
      const { questionId, selectedOptionId } = response;
      return prisma.userQuizResponse.create({
        data: {
          quizAttemptId: attemptId,
          questionId,
          selectedOptionId,
        },
      });
    });

    const savedResponses = await Promise.all(responsePromises);

    // Calculate the number of correct responses
    const correctResponses = await prisma.userQuizResponse.findMany({
      where: {
        quizAttemptId: attemptId,
        selectedOption: { isCorrect: true },
      },
    });

    // Assuming each quiz has exactly 4 questions
    const totalQuestions = 4;
    const correctCount = correctResponses.length;

    // Calculate the score out of 100
    const score = (correctCount / totalQuestions) * 100;

    // Update the score of the quiz attempt
    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { score },
    });

    return apiSuccess(res, "Berhasil menjawab kuis!", {
      savedResponses,
      score,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAttempts,
  getAttemptByQuizId,
  createAttempt,
};
