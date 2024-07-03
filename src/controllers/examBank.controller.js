import BadRequestError from "../errors/badRequest.js";
import { examBankService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";
import prisma from "../lib/prisma.js";

const index = async (req, res, next) => {
  try {
    const examBanks = await examBankService.getExamBanks();

    return apiSuccess(res, "Sukses mendapatkan semua bank soal!", examBanks);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const examBank = await examBankService.getOneExamBank(req.params.id);

    return apiSuccess(res, "Sukses mendapatkan bank soal!", examBank);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, chapterId } = req.body;

    const files = req.files;

    if (!files.icon && !files.fileBank) {
      throw new BadRequestError("File harus ada!");
    }

    const iconUrl = await uploadToBucket(files.icon[0], "exam-banks/icons");
    const fileBankUrl = await uploadToBucket(
      files.fileBank[0],
      "exam-banks/files"
    );

    const examBank = await prisma.examBank.create({
      data: {
        title,
        chapterId,
        filePath: fileBankUrl,
        icon: iconUrl,
      },
    });

    return apiSuccess(res, "Berhasil membuat bank soal!", examBank);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, chapterId } = req.body;

    const files = req.files;

    if (!files.icon && !files.fileBank) {
      throw new BadRequestError("File harus ada!");
    }

    const updatedData = {
      title,
      chapterId,
    };

    if (files.icon) {
      const iconUrl = await uploadToBucket(files.icon[0], "exam-banks/icons");
      updatedData.icon = iconUrl;
    }

    if (files.fileBank) {
      const fileBankUrl = await uploadToBucket(
        files.icon[0],
        "exam-banks/files"
      );
      updatedData.filePath = fileBankUrl;
    }

    const examBank = await prisma.examBank.update({
      where: { id },
      data: updatedData,
    });

    return apiSuccess(res, "Berhasil update bank soal!", examBank);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.examBank.findFirstOrThrow({
      where: {
        id,
      },
    });

    await prisma.examBank.delete({
      where: {
        id,
      },
    });

    return apiSuccess(res, "Berhasil hapus data!");
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
  create,
  update,
  destroy,
};
