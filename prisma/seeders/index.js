import prisma from "../../src/lib/prisma.js";
import chapterSeed from "./chapter.seed.js";
import examBankSeed from "./examBank.seed.js";
import formulaBankSeed from "./formulaBank.seed.js";
import materialSeed from "./material.seed.js";
import materialBankSeed from "./materialBank.seed.js";
import simulationSeed from "./simulation.seeder.js";
import userSeed from "./user.seed.js";

async function main() {
  await userSeed();

  const createdChapters = await chapterSeed();

  await examBankSeed(createdChapters);
  await materialBankSeed(createdChapters);
  await formulaBankSeed(createdChapters);

  const simulations = await simulationSeed(createdChapters);

  await materialSeed(simulations);
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
