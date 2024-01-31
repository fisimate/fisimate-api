import { userService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const changePassword = async (req, res, next) => {
  try {
    const result = await userService.changePassword(req);

    return apiSuccess(res, "Berhasil update password!", result);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req);

    return apiSuccess(res, "Berhasil update profile!", result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getOneUser(req);

    return apiSuccess(res, "Berhasil mendapatkan profile user!", user);
  } catch (error) {
    next(error);
  }
};

export default {
  changePassword,
  updateProfile,
  getProfile,
};
