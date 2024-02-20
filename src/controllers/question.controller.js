import { questionService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const questions = await questionService.getAllQuestions(req.query.quizId);

    return apiSuccess(
      res,
      "Berhasil mendapatkan semua pertanyaan kuis!",
      questions
    );
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const question = await questionService.getOneQuestion(req.params.id);

    return apiSuccess(res, "Berhasil mendapatkan petanyaan kuis!", question);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
};
