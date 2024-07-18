import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import { materialService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

const show = async (req, res, next) => {
  try {
    const result = await materialService.getMaterial(req.params.simulationId);

    return apiSuccess(res, "Berhasil mendapatkan materi simulasi!", result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { simulationId } = req.params;

    const file = req.file;

    if (!file) {
      throw new BadRequestError("File belum diupload!");
    }

    const fileUrl = await uploadToBucket(file, "simulations/materials");

    const simulationMaterial = await prisma.material.create({
      data: {
        simulationId,
        filePath: fileUrl,
      },
    });

    return apiSuccess(res, "Berhasil membuat materi!", simulationMaterial);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = req.file;

    if (!file) {
      throw new BadRequestError("File belum diupload!");
    }

    const fileUrl = await uploadToBucket(file, "simulations/materials");

    const simulationMaterial = await prisma.material.update({
      where: {
        id,
      },
      data: {
        filePath: fileUrl,
      },
    });

    return apiSuccess(res, "Berhasil update data!", simulationMaterial);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.material.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        simulation: true,
      },
    });

    return apiSuccess(res, "Berhasil hapus data!");
  } catch (error) {
    next(error);
  }
};

export default {
  show,
  create,
  update,
  destroy,
};
