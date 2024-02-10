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

const getFormulaBanks = async () => {
  const [totalChapters, totalSubChapters, formulaBanks] = await Promise.all([
    prisma.chapter.count(),
    prisma.formulaBank.count(),
    prisma.chapter.findMany({
      include: {
        formulaBanks: true,
      },
    }),
  ]);

  return {
    count: {
      chapters: totalChapters,
      sub_chapters: totalSubChapters,
    },
    result: formulaBanks,
  };
};

export default {
  getOneFormulaBank,
  getFormulaBanks,
};
