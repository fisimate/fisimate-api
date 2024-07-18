import prisma from "../lib/prisma.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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
    const { text } = req.body;
    let { options } = req.body;

    // Parse options if it's a string
    if (typeof options === "string") {
      options = JSON.parse(options);
    }

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
    const { simulationId, questionId } = req.params;
    const { text, deleteImage } = req.body;
    let { options } = req.body;

    const updatedData = {
      text,
    };

    // Parse options if it's a string
    if (typeof options === "string") {
      options = JSON.parse(options);
    }

    // Check if the image needs to be updated
    if (req.file) {
      const imageUrl = await uploadToBucket(req.file, "quiz-images");
      updatedData.imageUrl = imageUrl;
    }

    // Check if the image should be deleted
    if (deleteImage) {
      updatedData.imageUrl = null;
    }

    // Use a transaction to ensure atomicity
    await prisma.$transaction(async (prisma) => {
      // Update the question
      const updatedQuestion = await prisma.question.update({
        where: { id: questionId },
        data: updatedData,
      });

      // Update or create quiz options
      const optionPromises = options.map(async (option) => {
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

      // Fetch the updated simulation data
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
        "Berhasil memperbarui pertanyaan!",
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
    const { questionId } = req.params;

    await prisma.question.findFirstOrThrow({
      where: {
        id: questionId,
      },
    });

    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return apiSuccess(res, "Berhasil menghapus data!");
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
