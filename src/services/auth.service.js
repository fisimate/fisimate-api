import BadRequestError from "../errors/badRequest.js";
import { compare, encrypt } from "../lib/bcrypt.js";
import { createRefreshJWT, createToken } from "../lib/jwt.js";
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
      role: true
    }
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

  return { token, refreshToken, user };
};

const register = async (data) => {
  const { fullname, email, password, passwordConfirmation } = data;

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
      password: hashPassword,
      roleId: role.id,
    },
    include: {
      role: true,
    },
  });

  return exclude(user, ["password"]);
};

export default { login, register };
