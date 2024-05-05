import { quizService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const result = await quizService.getAllQuizzes(req.params.simulationId);

    return apiSuccess(res, "Berhasil mendapatkan kuis!", result);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const result = await quizService.getOneQuiz(req.params.id);

    return apiSuccess(res, "Berhasil mendapatkan kuis!", result);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
};
