import { encrypt } from "../lib/bcrypt.js";
import prisma from "../lib/prisma.js";
import { userService } from "../services/index.js";
import apiSuccess from "../utils/apiSuccess.js";
import exclude from "../utils/exclude.js";
import uploadToBucket from "../utils/uploadToBucket.js";

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

const updateProfilePicture = async (req, res, next) => {
  try {
    const result = await userService.updateProfilePicture(req);

    return apiSuccess(res, "Berhasil update foto profile!", result);
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: {
          name: "user",
        },
      },
    });

    return apiSuccess(
      res,
      "Berhasil mendapatkan data siswa!",
      exclude(students, ["password"])
    );
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { email, fullname, nis, password } = req.body;

    const profilePicture = await uploadToBucket(req.file);

    const role = await prisma.role.findFirstOrThrow({
      where: {
        name: "user",
      },
    });

    const students = await prisma.user.create({
      data: {
        email,
        fullname,
        nis,
        password: await encrypt(password),
        profilePicture,
        role: {
          connect: {
            id: role.id,
          },
        },
      },
    });

    return apiSuccess(res, "Berhasil membuat data!", students);
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, nis, fullname } = req.body;

    const updatedData = {
      email,
      nis,
      fullname,
    };

    await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
    });

    if (req.file) {
      const pictureUrl = await uploadToBucket(req.file);
      updatedData.profilePicture = pictureUrl;
    }

    const students = await prisma.user.update({
      data: updatedData,
      where: {
        id,
      },
    });

    return apiSuccess(res, "Berhasil update data!", students);
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
    });

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return apiSuccess(res, "Berhasil hapus data!");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { newPasword } = req.body;
    const { id } = req.params;

    await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
    });

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: await encrypt(newPasword),
      },
    });

    return apiSuccess(res, "Berhasil reset password!");
  } catch (error) {
    next(error);
  }
};

const getOneStudents = async (req, res, next) => {
  try {
    const { id } = req.params;

    const students = await prisma.user.findFirstOrThrow({
      where: {
        id,
      },
    });

    return apiSuccess(res, "Berhasil mendapatkan data!", students);
  } catch (error) {
    next(error);
  }
};

export default {
  changePassword,
  updateProfile,
  getProfile,
  updateProfilePicture,
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  resetPassword,
  getOneStudents,
};
