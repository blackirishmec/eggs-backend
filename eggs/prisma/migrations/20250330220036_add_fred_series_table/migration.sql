-- CreateTable
CREATE TABLE "fred_series" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "units" TEXT NOT NULL,
    "last_updated" TEXT NOT NULL,

    CONSTRAINT "fred_series_pkey" PRIMARY KEY ("id")
);
