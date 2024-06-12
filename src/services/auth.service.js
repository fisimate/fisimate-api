import BadRequestError from "../errors/badRequest.js";
import { compare, encrypt } from "../lib/bcrypt.js";
import {
  createRefreshJWT,
  createToken,
  isRefreshTokenValid,
} from "../lib/jwt.js";
import prisma from "../lib/prisma.js";
import { createTokenUser } from "../utils/createToken.js";
import exclude from "../utils/exclude.js";

const login = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new BadRequestError("Kredensial tidak valid!");
  }

  const comparePassword = await compare(password, user.password);

  if (!comparePassword) {
    throw new BadRequestError("Password salah!");
  }

  const token = createToken({ payload: createTokenUser(user) });

  const refreshToken = createRefreshJWT({ payload: createTokenUser(user) });

  await prisma.refreshToken.create({
    data: {
      refreshToken,
      userId: user.id,
    },
  });

  return {
    access_token: token,
    refresh_token: refreshToken,
    user: exclude(user, ["password"]),
  };
};

const register = async (data) => {
  const { fullname, email, nis, password, passwordConfirmation } = data;

  if (password !== passwordConfirmation) {
    throw new BadRequestError("Password tidak cocok!");
  }

  const hashPassword = await encrypt(password);

  const role = await prisma.role.findFirst({
    where: {
      name: "user",
    },
  });

  const user = await prisma.user.create({
    data: {
      fullname,
      email,
      nis,
      password: hashPassword,
      roleId: role.id,
    },
    include: {
      role: true,
    },
  });

  return exclude(user, ["password"]);
};

const refreshToken = async (req) => {
  const { refreshToken } = req.params;

  const result = await prisma.refreshToken.findFirst({
    where: {
      refreshToken,
    },
  });

  if (!result) {
    throw new BadRequestError("Token tidak valid!");
  }

  const payload = isRefreshTokenValid({ token: result.refreshToken });

  const userCheck = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  const token = createToken({ payload: createTokenUser(userCheck) });

  return token;
};

export default { login, register, refreshToken };
