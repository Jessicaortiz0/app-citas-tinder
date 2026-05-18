/*
  Warnings:

  - A unique constraint covering the columns `[cedula]` on the table `Paciente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula` to the `Paciente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paciente" ADD COLUMN     "cedula" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Paciente_cedula_key" ON "Paciente"("cedula");
