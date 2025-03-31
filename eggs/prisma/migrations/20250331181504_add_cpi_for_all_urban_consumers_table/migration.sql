-- CreateTable
CREATE TABLE "cpi_for_all_urban_consumers" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cpi_for_all_urban_consumers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cpi_for_all_urban_consumers_date_key" ON "cpi_for_all_urban_consumers"("date");
