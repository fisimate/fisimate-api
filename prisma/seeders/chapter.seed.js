import prisma from "../../src/lib/prisma.js";

const chapterSeed = async () => {
  const chapters = [
    {
      name: "Keseimbangan Benda",
      slug: "keseimbangan-benda",
    },
    {
      name: "Dinamika Rotasi",
      slug: "dinamika-rotasi",
    },
    {
      name: "Fluida",
      slug: "fluida",
    },
  ];

  await prisma.chapter.createMany({
    data: chapters,
  });

  return await prisma.chapter.findMany();
};

export default chapterSeed;
