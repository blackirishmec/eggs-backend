-- CreateTable
CREATE TABLE "egg_price" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "egg_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "median_cpi" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "median_cpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "federal_nonfarm_minimum_hourly_wage" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "federal_nonfarm_minimum_hourly_wage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "egg_price_date_key" ON "egg_price"("date");

-- CreateIndex
CREATE UNIQUE INDEX "median_cpi_date_key" ON "median_cpi"("date");

-- CreateIndex
CREATE UNIQUE INDEX "federal_nonfarm_minimum_hourly_wage_date_key" ON "federal_nonfarm_minimum_hourly_wage"("date");
