import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import { formulaBankService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

const getAll = async (req, res, next) => {
  try {
    const formulaBank = await prisma.formulaBank.findMany({
      include: {
        chapter: true,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", formulaBank);
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const formulaBanks = await formulaBankService.getFormulaBanks();

    return apiSuccess(
      res,
      "Sukses mendapatkan semua bank rumus!",
      formulaBanks
    );
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const formulaBank = await formulaBankService.getOneFormulaBank(
      req.params.id
    );

    return apiSuccess(res, "Sukses mendapatkan bank rumus!", formulaBank);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, chapterId } = req.body;

    const files = req.files;

    if (!files.icon && !files.filePath) {
      throw new BadRequestError("File harus ada!");
    }

    const iconUrl = await uploadToBucket(files.icon[0], "formula-banks/icons");
    const fileBankUrl = await uploadToBucket(
      files.filePath[0],
      "formula-banks/files"
    );

    const formulaBank = await prisma.formulaBank.create({
      data: {
        title,
        chapterId,
        filePath: fileBankUrl,
        icon: iconUrl,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan bank rumus", formulaBank);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, chapterId } = req.body;

    const files = req.files;

    if (!files.icon && !files.filePath) {
      throw new BadRequestError("File harus ada!");
    }

    const updatedData = {
      title,
      chapterId,
    };

    if (files.icon) {
      const iconUrl = await uploadToBucket(
        files.icon[0],
        "formula-banks/icons"
      );
      updatedData.icon = iconUrl;
    }

    if (files.filePath) {
      const fileBankUrl = await uploadToBucket(
        files.filePath[0],
        "formula-banks/files"
      );
      updatedData.filePath = fileBankUrl;
    }

    const formulaBank = await prisma.formulaBank.update({
      where: { id },
      data: updatedData,
    });

    return apiSuccess(res, "Berhasil update bank rumus!", formulaBank);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.formulaBank.findFirstOrThrow({
      where: {
        id,
      },
    });

    await prisma.formulaBank.delete({
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
  getAll,
};
