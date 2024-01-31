import { userService } from "../services/index.js";

const changePassword = async (req, res, next) => {
  try {
    const result = await userService.changePassword(req);

    return res.json({
      succes: true,
      message: "Berhasil update password!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req);

    return res.json({
      succes: true,
      message: "Berhasil update password!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getOneUser(req);

    return res
      .json({
        success: true,
        message: "Berhasil mendapatkan profile user!",
        data: user,
      })
      .status(200);
  } catch (error) {
    next(error);
  }
};

export default {
  changePassword,
  updateProfile,
  getProfile,
};
