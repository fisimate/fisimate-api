import prisma from "../lib/prisma.js";
import apiSuccess from "../utils/apiSuccess.js";

// get all quizzes by simulation id
const getQuizBySimulation = async (req, res, next) => {
  try {
    const { simulationId } = req.params;

    const quiz = await prisma.quiz.findFirstOrThrow({
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

    return apiSuccess(res, "Berhasil mendapatkan kuis!", quiz);
  } catch (error) {
    next(error);
  }
};

// get quiz by id
const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            quizOptions: true,
          },
        },
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan kuis!", quiz);
  } catch (error) {
    next(error);
  }
};

// create new quiz
const create = async (req, res, next) => {
  try {
    const { simulationId, questions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        simulationId,
        questions: {
          create: questions.map((question) => ({
            text: question.text,
            quizOptions: {
              create: question.quizOptions.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
    });

    return apiSuccess(res, "Berhasil membuat kuis!", quiz);
  } catch (error) {
    next(error);
  }
};

// Update quiz
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { simulationId, questions } = req.body;

    const updatePromises = questions.map(async (question) => {
      if (question.id) {
        // If question ID is provided, update the existing question
        const updatedQuestion = await prisma.question.update({
          where: { id: question.id },
          data: {
            text: question.text,
          },
        });

        // Update or create quiz options
        const optionPromises = question.quizOptions.map(async (option) => {
          if (option.id) {
            // If option ID is provided, update the existing option
            return prisma.quizOption.update({
              where: { id: option.id },
              data: {
                text: option.text,
                isCorrect: option.isCorrect,
              },
            });
          } else {
            // If no option ID, create a new option
            return prisma.quizOption.create({
              data: {
                text: option.text,
                isCorrect: option.isCorrect,
                questionId: question.id,
              },
            });
          }
        });

        await Promise.all(optionPromises);

        return updatedQuestion;
      } else {
        // If no question ID, create a new question and options
        return prisma.question.create({
          data: {
            text: question.text,
            quizId: id,
            quizOptions: {
              create: question.quizOptions.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          },
        });
      }
    });

    await Promise.all(updatePromises);

    // Update the quiz itself
    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
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

    return apiSuccess(res, "Berhasil update kuis!", quiz);
  } catch (error) {
    next(error);
  }
};

// Delete quiz
const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.quiz.delete({
      where: {
        id,
      },
    });

    return apiSuccess(res, "Berhasil menghapus data!");
  } catch (error) {
    next(error);
  }
};

export default {
  getQuizBySimulation,
  getQuizById,
  create,
  update,
  destroy,
};
