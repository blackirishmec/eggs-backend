/*
  Warnings:

  - The primary key for the `fred_series` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "fred_series" DROP CONSTRAINT "fred_series_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "fred_series_pkey" PRIMARY KEY ("id");
