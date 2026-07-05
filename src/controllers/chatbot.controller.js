import { chatbotService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const generateQuestion = async (req, res, next) => {
  try {
    const { chapter } = req.body;

    const question = await chatbotService.generateQuestion(chapter);

    return apiSuccess(res, "Berhasil menghasilkan soal!", question);
  } catch (error) {
    next(error);
  }
};

export default {
  generateQuestion,
};
