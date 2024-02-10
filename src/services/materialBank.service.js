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

export default {
  getOneMaterialBank,
  getMaterialBanks,
};
