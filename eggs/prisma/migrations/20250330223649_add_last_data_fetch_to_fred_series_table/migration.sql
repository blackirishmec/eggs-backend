/*
  Warnings:

  - Added the required column `last_data_fetch` to the `fred_series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fred_series" ADD COLUMN     "last_data_fetch" TEXT NOT NULL;
