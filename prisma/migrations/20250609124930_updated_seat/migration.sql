/*
  Warnings:

  - The primary key for the `Seat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Seat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Seat_pkey" PRIMARY KEY ("showtimeId", "seatNumber");
