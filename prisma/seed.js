import prisma from "../src/lib/prisma.js";

async function main() {
  const roles = [
    {
      name: "admin",
    },
    {
      name: "teacher",
    },
    {
      name: "user",
    },
  ];

  await prisma.role.createMany({
    data: roles,
  });

  const chapters = [
    {
      name: "Keseimbangan Benda",
    },
    {
      name: "Dinamika Rotasi",
    },
    {
      name: "Fluida",
    },
  ];

  await prisma.chapter.createMany({
    data: chapters,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit;
  });
