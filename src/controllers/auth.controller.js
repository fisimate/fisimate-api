import passport from "passport";
import { createToken } from "../lib/jwt.js";
import { createTokenUser } from "../utils/createToken.js";
import { useFacebookStrategy, useGoogleStrategy } from "../lib/passport.js";
import configs from "../configs/index.js";
import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import { authService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    return apiSuccess(res, "Berhasil mendaftar akun!", result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    return apiSuccess(res, "Berhasil masuk!", result);
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { otp, email } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestError("User tidak ditemukan!");
    }

    if (user.isVerified === true) {
      throw new BadRequestError("Akun sudah diverifikasi");
    }

    if (otp !== user.otp) {
      throw new BadRequestError("OTP tidak valid!");
    }

    const verifiedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        otp: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res
      .json({
        success: true,
        message: "Verifikasi berhasil!",
        data: verifiedUser,
      })
      .status(200);
  } catch (error) {
    next(error);
  }
};

const getGoogleUrl = (req, res, next) => {
  try {
    useGoogleStrategy();

    // Access the Google OAuth strategy
    const googleStrategy = passport._strategy("google");

    const authUrl = googleStrategy._oauth2.getAuthorizeUrl({
      response_type: "code",
      scope: "profile email",
      redirect_uri: configs.googleClientRedirect,
    });

    return res.status(200).json({
      success: true,
      message: "Success get url login",
      data: {
        authUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

const googleCallback = (req, res, next) => {
  try {
    console.log(req.user);
    const token = createToken({ payload: createTokenUser(req.user) });

    return res.status(200).json({
      success: true,
      message: "Success login",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getFacebookUrl = (req, res, next) => {
  try {
    useFacebookStrategy();

    const facebookStrategy = passport._strategy("facebook");

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${
      facebookStrategy._oauth2._clientId
    }&redirect_uri=${encodeURIComponent(
      configs.facebookClientRedirect
    )}&scope=email&response_type=code&auth_type=rerequest`;

    return res.status(200).json({
      success: true,
      message: "Success get Facebook login URL",
      data: {
        authUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

const facebookCallback = (req, res, next) => {
  try {
    const token = createToken({ payload: createTokenUser(req.user) });

    return res.status(200).json({
      success: true,
      message: "Success login",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const result = await authService.refreshToken(req);

    return apiSuccess(res, "Sukses refresh token!", {
      access_token: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  verify,
  googleCallback,
  getGoogleUrl,
  getFacebookUrl,
  facebookCallback,
  refreshToken,
  logout,
};
