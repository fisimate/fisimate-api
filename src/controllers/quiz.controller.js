import prisma from "../lib/prisma.js";
import apiSuccess from "../utils/apiSuccess.js";

// get all quizzes by simulation id
const getQuizBySimulation = async (req, res, next) => {
  try {
    const { simulationId } = req.params;

    const simulation = await prisma.simulation.findFirstOrThrow({
      where: {
        id: simulationId,
      },
      include: {
        question: {
          include: {
            quizOptions: true,
          },
        },
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan simulasi!", simulation);
  } catch (error) {
    next(error);
  }
};

// create new quiz
const create = async (req, res, next) => {
  try {
    const { simulationId } = req.params;
    const { chapterId, questions } = req.body;

    // Find the existing simulation to ensure it exists
    const simulation = await prisma.simulation.findFirstOrThrow({
      where: {
        id: simulationId,
      },
    });

    // Create questions related to the found simulation
    const createdQuestions = await prisma.question.createMany({
      data: questions.map((question) => ({
        text: question.text,
        chapterId, // assuming chapterId needs to be associated with questions
        simulationId: simulation.id,
        quizOptions: {
          create: question.quizOptions.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
        },
      })),
    });

    return apiSuccess(res, "Berhasil membuat pertanyaan!", createdQuestions);
  } catch (error) {
    next(error);
  }
};

// Update quiz
const update = async (req, res, next) => {
  try {
    const { simulationId } = req.params;
    const { chapterId, questions } = req.body;

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
            // Otherwise, create a new option for the existing question
            return prisma.quizOption.create({
              data: {
                questionId: updatedQuestion.id,
                text: option.text,
                isCorrect: option.isCorrect,
              },
            });
          }
        });

        await Promise.all(optionPromises);
      } else {
        // Otherwise, create a new question with options
        await prisma.question.create({
          data: {
            simulationId: simulationId,
            text: question.text,
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

    const updatedSimulation = await prisma.simulation.update({
      where: { id: simulationId },
      data: { chapterId },
      include: {
        question: {
          include: {
            quizOptions: true,
          },
        },
      },
    });

    return apiSuccess(res, "Berhasil memperbarui simulasi!", updatedSimulation);
  } catch (error) {
    next(error);
  }
};

// delete quiz by id
const deleteQuizById = async (req, res, next) => {
  try {
    const { simulationId } = req.params;

    await prisma.simulation.delete({
      where: {
        id: simulationId,
      },
    });

    return apiSuccess(res, "Berhasil menghapus simulasi!");
  } catch (error) {
    next(error);
  }
};

export default {
  getQuizBySimulation,
  create,
  update,
  deleteQuizById,
};
