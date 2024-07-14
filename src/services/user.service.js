import BadRequestError from "../errors/badRequest.js";
import { compare, encrypt } from "../lib/bcrypt.js";
import bucket from "../lib/bucket.js";
import randomString from "../lib/crypto.js";
import prisma from "../lib/prisma.js";
import exclude from "../utils/exclude.js";
import path from "path";

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

const updateProfilePicture = async (req) => {
  const { id } = req.user;

  if (!req.file) {
    throw new BadRequestError("File belum diupload!");
  }

  const extension = path.extname(req.file.originalname);
  const randomName = randomString(14) + extension;

  const blob = bucket.file(`profile-pictures/${randomName}`);
  const blobStream = blob.createWriteStream({ resumable: true });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      reject(new Error("Server error, tidak bisa upload image"));
    });

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      try {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: { profilePicture: publicUrl },
        });

        resolve(exclude(updatedUser, ["password"]));
      } catch (error) {
        reject(new Error("System error, tidak bisa update user"));
      }
    });

    blobStream.end(req.file.buffer);
  });
};

export default {
  updateProfile,
  changePassword,
  getOneUser,
  updateProfilePicture,
};
