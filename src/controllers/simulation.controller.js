import { simulationService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

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

export default {
  index,
  show,
};
