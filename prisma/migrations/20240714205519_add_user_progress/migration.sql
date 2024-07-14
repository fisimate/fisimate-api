-- CreateTable
CREATE TABLE "SimulationProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulationProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SimulationProgress_userId_simulation_id_key" ON "SimulationProgress"("userId", "simulation_id");

-- AddForeignKey
ALTER TABLE "SimulationProgress" ADD CONSTRAINT "SimulationProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulationProgress" ADD CONSTRAINT "SimulationProgress_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "Simulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
