import prisma from "../lib/prisma.js";

const getOneMaterialBank = async (id) => {
  const materialBank = await prisma.materialBank.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      chapter: true,
    },
  });

  return materialBank;
};

const getMaterialBanks = async () => {
  const [totalChapters, totalSubChapters, materialBanks] = await Promise.all([
    prisma.chapter.count(),
    prisma.materialBank.count(),
    prisma.chapter.findMany({
      include: {
        materialBanks: true,
      },
    }),
  ]);

  return {
    count: {
      chapters: totalChapters,
      sub_chapters: totalSubChapters,
    },
    result: materialBanks,
  };
};

const createMaterial = async (data) => {
  return await prisma.materialBank.create({
    data,
  });
};

const update = async (data) => {
  const materialBank = await prisma.materialBank.update({
    data,
    where: {
      id,
    },
  });

  return materialBank;
};

const remove = async (id) => {
  return await prisma.materialBank.delete({
    where: {
      id,
    },
  });
};

export default {
  getOneMaterialBank,
  getMaterialBanks,
  createMaterial,
  update,
  remove,
};
