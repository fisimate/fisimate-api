import prisma from "../lib/prisma.js";
import { dashboardService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const result = await dashboardService.dashboard();

    return apiSuccess(
      res,
      "Berhasil mendapatkan data untuk dashboard!",
      result
    );
  } catch (error) {
    next(error);
  }
};

const leaderboard = async (req, res, next) => {
  try {
    const result = await dashboardService.getLeaderboard(req);

    return apiSuccess(res, "Berhasil mendapatkan data leaderboard", result);
  } catch (error) {
    next(error);
  }
};

const mobileDashboard = async (req, res, next) => {
  try {
    const result = await prisma.chapter.findMany({
      include: {
        examBanks: true,
        materialBanks: true,
        formulaBanks: true,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data", result);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  leaderboard,
  mobileDashboard,
};
