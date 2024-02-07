import prisma from "../../src/lib/prisma.js";
import chapterSeed from "./chapter.seed.js";
import examBankSeed from "./examBank.seed.js";
import userSeed from "./user.seed.js";

async function main() {
  await userSeed();

  const createdChapters = await chapterSeed();

  await examBankSeed(createdChapters);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
