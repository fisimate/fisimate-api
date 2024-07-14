import BadRequestError from "../errors/badRequest.js";
import prisma from "../lib/prisma.js";
import generateSlug from "../utils/generateSlug.js";
import uploadToBucket from "../utils/uploadToBucket.js";

const getAlls = async () => {
  const chapters = await prisma.chapter.findMany({
    include: {
      materialBanks: true,
      formulaBanks: true,
      examBanks: true,
      simulations: true,
    },
  });

  return chapters;
};

const create = async (req) => {
  const { name, shortDescription } = req.body;

  const slug = generateSlug(name);

  if (!req.file) {
    throw new BadRequestError("Icon harus ada!");
  }

  const iconUrl = await uploadToBucket(req.file, "chapters/icons");

  const chapter = await prisma.chapter.create({
    data: {
      name,
      slug,
      shortDescription,
      icon: iconUrl,
    },
  });

  return chapter;
};

const getOne = async (chapterId) => {
  const chapter = await prisma.chapter.findFirstOrThrow({
    where: {
      id: chapterId,
    },
  });

  return chapter;
};

const update = async (chapterId, req) => {
  const { name, shortDescription } = req.body;
  const slug = generateSlug(name);

  const updatedData = {
    name,
    shortDescription,
    slug,
  };

  if (req.file) {
    const iconUrl = await uploadToBucket(req.file, "chapters/icons");
    updatedData.icon = iconUrl;
  }

  const chapter = await prisma.chapter.update({
    where: {
      id: chapterId,
    },
    data: updatedData,
  });

  return chapter;
};

const remove = async (chapterId) => {
  return await prisma.chapter.delete({
    where: {
      id: chapterId,
    },
  });
};

export default {
  getAlls,
  getOne,
  create,
  update,
  remove,
};
