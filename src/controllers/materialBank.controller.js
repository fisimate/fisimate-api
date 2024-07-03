import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import { materialBankService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

const index = async (req, res, next) => {
  try {
    const materialBanks = await materialBankService.getMaterialBanks();

    return apiSuccess(
      res,
      "Sukses mendapatkan semua bank materi!",
      materialBanks
    );
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const materialBank = await materialBankService.getOneMaterialBank(
      req.params.id
    );

    return apiSuccess(res, "Sukses mendapatkan bank materi!", materialBank);
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

    const iconUrl = await uploadToBucket(files.icon[0], "material-banks/icons");
    const fileBankUrl = await uploadToBucket(
      files.filePath[0],
      "material-banks/files"
    );

    const materialBank = await prisma.materialBank.create({
      data: {
        title,
        chapterId,
        filePath: fileBankUrl,
        icon: iconUrl,
      },
    });

    return apiSuccess(res, "Berhasil membuat bank soal!", materialBank);
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
        "material-banks/icons"
      );
      updatedData.icon = iconUrl;
    }

    if (files.filePath) {
      const fileBankUrl = await uploadToBucket(
        files.filePath[0],
        "material-banks/files"
      );
      updatedData.filePath = fileBankUrl;
    }

    const materialBank = await prisma.materialBank.update({
      where: { id },
      data: updatedData,
    });

    return apiSuccess(res, "Berhasil update bank materi!", materialBank);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.materialBank.findFirstOrThrow({
      where: {
        id,
      },
    });

    await prisma.materialBank.delete({
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
