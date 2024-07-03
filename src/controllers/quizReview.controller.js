import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

// Get review by quizId
const index = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quizReview = await prisma.quizReview.findFirstOrThrow({
      where: {
        quizId,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", quizReview);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const file = req.file;

    await prisma.quiz.findFirstOrThrow({
      where: {
        id: quizId,
      },
    });

    if (!file) {
      throw new BadRequestError("File harus ada!");
    }

    const fileUrl = await uploadToBucket(file, "quiz-reviews");

    const quizReview = await prisma.quizReview.create({
      data: {
        quizId,
        filePath: fileUrl,
      },
    });

    return apiSuccess(res, "Berhasil membuat data!", quizReview);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const file = req.file;

    await prisma.quiz.findFirstOrThrow({
      where: {
        id: quizId,
      },
    });

    if (!file) {
      throw new BadRequestError("File harus ada!");
    }

    const fileUrl = await uploadToBucket(file, "quiz-reviews");

    const quizReview = await prisma.quizReview.update({
      data: {
        filePath: fileUrl,
      },
      where: {
        quizId,
      },
    });

    return apiSuccess(res, "Berhasil update data!", quizReview);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    await prisma.quizReview.findFirstOrThrow({
      where: {
        quizId,
      },
    });

    await prisma.quizReview.delete({
      where: {
        quizid,
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
