import { materialService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const show = async (req, res, next) => {
  try {
    const result = await materialService.getMaterial(req.params.simulationId);

    return apiSuccess(res, "Berhasil mendapatkan materi simulasi!", result);
  } catch (error) {
    next(error);
  }
};

export default {
  show,
};
