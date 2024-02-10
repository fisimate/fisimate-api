import { materialBankService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const index = async (req, res, next) => {
  try {
    const materialBanks = await materialBankService.getMaterialBanks();

    return apiSuccess(
      res,
      "Sukses mendapatkan semua bank materi!",
      materialBanks
    );
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try {
    const materialBank = await materialBankService.getOneMaterialBank(
      req.params.id
    );

    return apiSuccess(res, "Sukses mendapatkan bank materi!", materialBank);
  } catch (error) {
    next(error);
  }
};

export default {
  index,
  show,
};
