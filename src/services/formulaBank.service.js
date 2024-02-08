import prisma from "../lib/prisma.js";

const getOneFormulaBank = async (id) => {
  const formulaBank = await prisma.formulaBank.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      chapter: true,
    },
  });

    return formulaBank;
};

export default {
  getOneFormulaBank,
};
