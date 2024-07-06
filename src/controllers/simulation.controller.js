import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import { simulationService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";
import uploadToBucket from "../utils/uploadToBucket.js";

const index = async (req, res, next) => {
  try {
    const simulations = await simulationService.getAllSimulations(req);

    return apiSuccess(res, "Berhasil mendapatkan semua simulasi!", simulations);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const simulation = await simulationService.getOneSimulation(req.params.id);

    return apiSuccess(res, "Berhasil mendapatkan data simulasi!", simulation);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, chapterId } = req.body;

    const updatedData = {
      title,
      chapter: {
        connect: {
          id: chapterId,
        },
      },
    };

    if (req.file) {
      const iconUrl = await uploadToBucket(req.file, "simulations/icons");
      updatedData.icon = iconUrl;
    }

    const simulation = await prisma.simulation.update({
      where: {
        id,
      },
      data: updatedData,
    });

    return apiSuccess(res, "Berhasil update data!", simulation);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
  update,
};
