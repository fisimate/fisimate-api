import BadRequestError from "../errors/badRequest.js";
import { compare, encrypt } from "../lib/bcrypt.js";
import bucket from "../lib/bucket.js";
import randomString from "../lib/crypto.js";
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

const updateProfilePicture = async (req) => {
  const { id } = req.user;

  if (!req.file) {
    throw new BadRequestError("File belum diupload!");
  }

  const randomName = randomString(14);

  const blob = bucket.file(`profile_pictures/${randomName}`);
  const blobStream = blob.createWriteStream({ resumable: true });

  blobStream.on("error", (err) => {
    throw new Error("Server error, tidak bisa upload image");
  });

  blobStream.on("finish", async () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        profilePicture: publicUrl,
      },
    });

    return exclude(updatedUser, ["password"]);
  });

  blobStream.end(req.file.buffer);
};

export default {
  updateProfile,
  changePassword,
  getOneUser,
  updateProfilePicture,
};
