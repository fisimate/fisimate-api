import BadRequestError from "../errors/badRequest.js";
import { compare, encrypt } from "../lib/bcrypt.js";
import prisma from "../lib/prisma.js";

const updateProfile = async (req) => {
  const { email, fullname } = req.body;

  const { id } = req.user;

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      email,
      fullname,
    },
    select: {
      id: true,
      email: true,
      fullname: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
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

  console.log(userPasssword);

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

  return {
    id: user.id,
    email: user.email,
    fullname: user.fullname,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const getOneUser = async (req) => {
  const { id } = req.user;

  const user = await prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      fullname: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

export default {
  updateProfile,
  changePassword,
  getOneUser,
};
