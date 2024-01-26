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
