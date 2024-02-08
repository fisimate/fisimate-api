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

export default {
  getOneMaterialBank,
};
