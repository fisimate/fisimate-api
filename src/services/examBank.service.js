import prisma from "../lib/prisma.js";

const getOneExamBank = async (id) => {
  const examBank = await prisma.examBank.findFirstOrThrow({
    where: {
      id,
    },
    include: {
      chapter: true,
    },
  });

  return examBank;
};

export default {
  getOneExamBank,
};
