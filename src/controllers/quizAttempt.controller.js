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
        simulation: true,
        userQuizResponse: true,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", attempts);
  } catch (error) {
    next(error);
  }
};
// history berdasarkan user id di params
const getAttemptHistories = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
      },
      include: {
        simulation: true,
        userQuizResponse: true,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", attempts);
  } catch (error) {
    next(error);
  }
};

const getAttemptBySimulationId = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { simulationId } = req.params;

    const attempt = await prisma.quizAttempt.findFirstOrThrow({
      where: {
        simulationId,
        AND: {
          userId,
        },
      },
      include: {
        simulation: {
          include: {
            question: {
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
    const { responses } = req.body;
    const { simulationId } = req.params;

    // Validate simulationId
    const simulation = await prisma.simulation.findFirstOrThrow({
      where: { id: simulationId },
    });

    // Check if the user has already attempted this simulation
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        simulationId,
        userId,
      },
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: "User has already attempted this simulation.",
      });
    }

    // Validate responses
    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Responses must be a non-empty array.",
      });
    }

    // Validate each response
    for (const response of responses) {
      if (!response.questionId || !response.selectedOptionId) {
        return res.status(400).json({
          success: false,
          message: "Each response must have a questionId and selectedOptionId.",
        });
      }

      const question = await prisma.question.findFirstOrThrow({
        where: { id: response.questionId },
      });

      if (!question || question.simulationId !== simulationId) {
        return res.status(400).json({
          success: false,
          message: `Invalid answer.`,
        });
      }

      const option = await prisma.quizOption.findFirstOrThrow({
        where: { id: response.selectedOptionId },
      });

      if (!option || option.questionId !== response.questionId) {
        return res.status(400).json({
          success: false,
          message: `Invalid answer.`,
        });
      }
    }

    // Start a transaction
    await prisma
      .$transaction(async (prisma) => {
        // Step 1: Create a new quiz attempt
        const quizAttempt = await prisma.quizAttempt.create({
          data: {
            simulationId,
            userId,
            score: 0, // Initial score is 0, will be updated after evaluating responses
            attemptAt: new Date(),
          },
        });

        const attemptId = quizAttempt.id;

        // Step 2: Save user responses
        const responsePromises = responses.map((response) => {
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

        // Step 3: Calculate the number of correct responses
        const correctResponses = await prisma.userQuizResponse.findMany({
          where: {
            quizAttemptId: attemptId,
            selectedOption: { isCorrect: true },
          },
        });

        // Assuming each simulation has exactly 4 questions
        const totalQuestions = 4;
        const correctCount = correctResponses.length;

        // Step 4: Calculate the score out of 100
        const score = (correctCount / totalQuestions) * 100;

        // Step 5: Update the score of the quiz attempt
        await prisma.quizAttempt.update({
          where: { id: attemptId },
          data: { score },
        });

        return { savedResponses, score };
      })
      .then((result) => {
        return apiSuccess(res, "Berhasil menjawab simulasi!", {
          savedResponses: result.savedResponses,
          score: result.score,
        });
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    next(error);
  }
};

const getUserScore = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { simulationId } = req.params;

    // Fetch the quiz attempt
    const quizAttempt = await prisma.quizAttempt.findFirst({
      where: {
        simulationId,
        userId,
      },
      include: {
        userQuizResponse: {
          include: {
            question: true,
            selectedOption: true,
          },
        },
      },
    });

    if (!quizAttempt) {
      return res.status(404).json({
        success: false,
        message: "Quiz attempt not found.",
      });
    }

    // Calculate correct and incorrect responses
    const correctResponses = quizAttempt.userQuizResponse.filter(
      (response) => response.selectedOption.isCorrect
    );
    const incorrectResponses = quizAttempt.userQuizResponse.filter(
      (response) => !response.selectedOption.isCorrect
    );

    // Prepare the result data
    const result = {
      score: quizAttempt.score,
      correctResponses: correctResponses.map((response) => ({
        questionId: response.question.id,
        questionText: response.question.text,
        selectedOptionId: response.selectedOption.id,
        selectedOptionText: response.selectedOption.text,
      })),
      incorrectResponses: incorrectResponses.map((response) => ({
        questionId: response.question.id,
        questionText: response.question.text,
        selectedOptionId: response.selectedOption.id,
        selectedOptionText: response.selectedOption.text,
      })),
    };

    return res.json({
      success: true,
      message: "Berhasil mendapatkan data skor",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllAttempts,
  getAttemptBySimulationId,
  createAttempt,
  getUserScore,
  getAttemptHistories,
};
