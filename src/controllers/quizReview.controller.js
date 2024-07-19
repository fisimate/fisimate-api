import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

// Get review by simulationId
const index = async (req, res, next) => {
  try {
    const { simulationId } = req.params;

    const simulationReview = await prisma.quizReview.findFirst({
      where: {
        simulationId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", simulationReview);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { simulationId } = req.params;
    const file = req.file;

    await prisma.simulation.findFirstOrThrow({
      where: {
        id: simulationId,
      },
    });

    if (!file) {
      throw new BadRequestError("File harus ada!");
    }

    const fileUrl = await uploadToBucket(file, "simulation-reviews");

    const simulationReview = await prisma.quizReview.create({
      data: {
        simulationId,
        filePath: fileUrl,
      },
    });

    return apiSuccess(res, "Berhasil membuat data!", simulationReview);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { simulationId } = req.params;
    const file = req.file;

    await prisma.simulation.findFirstOrThrow({
      where: {
        id: simulationId,
      },
    });

    if (!file) {
      throw new BadRequestError("File harus ada!");
    }

    const fileUrl = await uploadToBucket(file, "simulation-reviews");

    const quizReview = await prisma.quizReview.findFirstOrThrow({
      where: {
        simulationId,
      },
    });

    const simulationReview = await prisma.quizReview.update({
      data: {
        filePath: fileUrl,
      },
      where: {
        id: quizReview.id,
      },
    });

    return apiSuccess(res, "Berhasil update data!", simulationReview);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { simulationId } = req.params;

    const quizReview = await prisma.quizReview.findFirstOrThrow({
      where: {
        simulationId,
      },
    });

    // Delete the quizReview using its unique id
    await prisma.quizReview.delete({
      where: {
        id: quizReview.id,
      },
    });
    return apiSuccess(res, "Berhasil hapus data!");
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  create,
  update,
  destroy,
};
