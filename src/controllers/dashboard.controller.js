import { dashboardService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const result = await dashboardService.dashboard(req);

    return apiSuccess(
      req,
      "Berhasil mendapatkan data untuk dashboard!",
      result
    );
  } catch (error) {
    next(error);
  }
};

export default {
  index,
};
