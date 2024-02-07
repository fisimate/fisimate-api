import { chapterService, examBankService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const examBanks = await chapterService.getExambanks();

    return apiSuccess(res, "Sukses mendapatkan semua bank soal!", examBanks);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const examBank = await examBankService.getOneExamBank(req.params.id);

    return apiSuccess(res, "Sukses mendapatkan bank soal!", examBank);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
};
