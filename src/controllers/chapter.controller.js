import { chapterService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const chapters = await chapterService.getAlls();

    return apiSuccess(res, "Berhasil mendapatkan semua data bab!", chapters);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
};
