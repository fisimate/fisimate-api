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
    const { text, options } = req.body;

    await prisma.$transaction(async (prisma) => {
      // Find the existing simulation to ensure it exists
      const simulation = await prisma.simulation.findFirstOrThrow({
        where: {
          id: simulationId,
        },
      });

      let imageUrl = null;

      // Check if an image is provided
      if (req.file) {
        imageUrl = await uploadToBucket(req.file, "quiz-images");
      }

      // Create the question
      const createdQuestion = await prisma.question.create({
        data: {
          text,
          imageUrl,
          simulationId: simulation.id,
          quizOptions: {
            create: options.map((option) => ({
              text: option.text,
              isCorrect: option.isCorrect,
            })),
          },
        },
        include: {
          quizOptions: true, // Include the related quizOptions in the response
        },
      });

      return apiSuccess(res, "Berhasil membuat pertanyaan!", createdQuestion);
    });
  } catch (error) {
    next(error);
  }
};

// Update quiz
const update = async (req, res, next) => {
  try {
    const { simulationId } = req.params;
    const { questions } = req.body;

    await prisma.$transaction(async (prisma) => {
      const updatePromises = questions.map(async (question) => {
        let imageUrl = null;

        if (question.image && req.files && req.files[question.image]) {
          imageUrl = await uploadToBucket(
            req.files[question.image],
            "quiz-images"
          );
        }

        if (question.id) {
          // If question ID is provided, update the existing question
          const updatedQuestion = await prisma.question.update({
            where: { id: question.id },
            data: {
              text: question.text,
              imageUrl: imageUrl || question.imageUrl, // Update image URL if new image is provided
            },
          });

          // Update or create quiz options
          const optionPromises = question.options.map(async (option) => {
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
              imageUrl,
              quizOptions: {
                create: question.options.map((option) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                })),
              },
            },
          });
        }
      });

      await Promise.all(updatePromises);

      const updatedSimulation = await prisma.simulation.findFirstOrThrow({
        where: { id: simulationId },
        include: {
          question: {
            include: {
              quizOptions: true,
            },
          },
        },
      });

      return apiSuccess(
        res,
        "Berhasil memperbarui simulasi!",
        updatedSimulation
      );
    });
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
