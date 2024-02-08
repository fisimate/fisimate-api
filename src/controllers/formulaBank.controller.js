import { chapterService, formulaBankService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const formulaBanks = await chapterService.getFormulaBanks();

    return apiSuccess(res, "Sukses mendapatkan semua bank rumus!", formulaBanks);
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const formulaBank = await formulaBankService.getOneFormulaBank(req.params.id);

    return apiSuccess(res, "Sukses mendapatkan bank rumus!", formulaBank);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
};
