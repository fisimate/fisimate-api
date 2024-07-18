import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

// Get review by simulationId
const index = async (req, res, next) => {
  try {
    const { simulationId } = req.params;

    const simulationReview = await prisma.quizReview.findFirstOrThrow({
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

    const simulationReview = await prisma.quizReview.update({
      data: {
        filePath: fileUrl,
      },
      where: {
        simulationId,
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

    await prisma.quizReview.findFirstOrThrow({
      where: {
        simulationId,
      },
    });

    await prisma.quizReview.delete({
      where: {
        simulationId,
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
