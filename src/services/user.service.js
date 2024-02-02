import BadRequestError from "../errors/badRequest.js";
import { compare, encrypt } from "../lib/bcrypt.js";
import prisma from "../lib/prisma.js";
import exclude from "../utils/exclude.js";

const updateProfile = async (req) => {
  const { email, fullname, nis } = req.body;

  const { id } = req.user;

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      email,
      fullname,
      nis,
    },
    include: {
      role: true,
    },
  });

  return exclude(user, ["password"]);
};

const changePassword = async (req) => {
  const { id } = req.user;

  const { oldPassword, newPassword, passwordConfirmation } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      role: true,
    },
  });

  const userPasssword = await compare(oldPassword, user.password);

  if (!userPasssword) {
    throw new BadRequestError("Password salah!");
  }

  if (newPassword !== passwordConfirmation) {
    throw new BadRequestError("Password baru tidak cocok!");
  }

  const hashPassword = await encrypt(newPassword);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashPassword,
    },
  });

  return exclude(user, ["password"]);
};

const getOneUser = async (req) => {
  const { id } = req.user;

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    include: {
      role: true,
    },
  });

  return exclude(user, ["password"]);
};

export default {
  updateProfile,
  changePassword,
  getOneUser,
};
