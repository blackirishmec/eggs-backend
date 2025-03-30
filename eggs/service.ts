import dotenv from 'dotenv';

import type { FetchDataResponse } from '@/eggs/interface';
import type {
	EggPrice,
	FederalNonfarmMinimumHourlyWage,
	MedianCPI,
} from '@prisma/client';

import { prisma } from '@/eggs/database';
import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchEggPriceFredData } from '@/eggs/utilities/api/fetchEggPriceFredData';
import { fetchFederalNonfarmMinimumHourlyWageFredData } from '@/eggs/utilities/api/fetchFederalNonfarmMinimumHourlyWageFredData';
import { getOrFetchFredSeries } from '@/eggs/utilities/api/getOrFetchFredSeries';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

const env = dotenv.config();
if (env.error) {
	throw env.error;
}

const EggsService = {
	fetchData: async (): Promise<FetchDataResponse> => {
		/** Get or Fetch Fred Series */
		const {
			eggPriceFredSeriesRecord,
			medianCPIFredSeriesRecord,
			federalNonfarmMinimumHourlyWageFredSeriesRecord,
		} = await getOrFetchFredSeries();

		/** Update DB via API Fetch */
		/** Egg Price */
		if (
			eggPriceFredSeriesRecord.lastDataFetch === null ||
			addOneMonthToDateString(eggPriceFredSeriesRecord.lastDataFetch) <
				new Date()
		) {
			const eggPriceFredData = await fetchEggPriceFredData();

			if (eggPriceFredData.length < 1) {
				return {
					success: false,
					message: 'Fetched eggPriceFredData empty!',
				};
			}

			const existingEggPriceRecordDateObjects = (
				await prisma.eggPrice.findMany({
					select: { date: true },
				})
			).map(
				existingEggPriceRecordDateObject =>
					existingEggPriceRecordDateObject.date,
			);

			await prisma.$transaction([
				prisma.eggPrice.createMany({
					data: eggPriceFredData.filter(
						eggPriceFredDataObject =>
							!existingEggPriceRecordDateObjects.includes(
								eggPriceFredDataObject.date,
							),
					),
					skipDuplicates: true,
				}),
				prisma.fredSeries.update({
					where: {
						id: eggPriceFredSeriesRecord.id,
					},
					data: {
						lastDataFetch: formatDateCustom(new Date()),
					},
				}),
			]);
		}

		/** Median CPI */
		if (
			medianCPIFredSeriesRecord.lastDataFetch === null ||
			addOneMonthToDateString(medianCPIFredSeriesRecord.lastDataFetch) <
				new Date()
		) {
			const medianCPIFredData =
				await fetchFederalNonfarmMinimumHourlyWageFredData();

			if (medianCPIFredData.length < 1) {
				return {
					success: false,
					message: 'Fetched medianCPIFredData empty!',
				};
			}

			await prisma.$transaction([
				prisma.medianCPI.createMany({
					data: medianCPIFredData,
				}),
				prisma.fredSeries.update({
					where: {
						id: medianCPIFredSeriesRecord.id,
					},
					data: {
						lastDataFetch: formatDateCustom(new Date()),
					},
				}),
			]);
		}

		/** Federal Nonfarm Minimum Hourly Wage */
		if (
			federalNonfarmMinimumHourlyWageFredSeriesRecord.lastDataFetch ===
				null ||
			addOneMonthToDateString(
				federalNonfarmMinimumHourlyWageFredSeriesRecord.lastDataFetch,
			) < new Date()
		) {
			const federalNonfarmMinimumHourlyWageFredData =
				await fetchFederalNonfarmMinimumHourlyWageFredData();

			if (federalNonfarmMinimumHourlyWageFredData.length < 1) {
				return {
					success: false,
					message:
						'Fetched federalNonfarmMinimumHourlyWageFredData empty!',
				};
			}

			await prisma.$transaction([
				prisma.federalNonfarmMinimumHourlyWage.createMany({
					data: federalNonfarmMinimumHourlyWageFredData,
				}),
				prisma.fredSeries.update({
					where: {
						id: federalNonfarmMinimumHourlyWageFredSeriesRecord.id,
					},
					data: {
						lastDataFetch: formatDateCustom(new Date()),
					},
				}),
			]);
		}

		/** Get Records */
		/** Egg Price */
		const eggPriceRecords: EggPrice[] = await prisma.eggPrice.findMany({
			orderBy: {
				date: 'desc',
			},
		});

		/** Median CPI */
		const medianCPIRecords: MedianCPI[] = await prisma.medianCPI.findMany({
			orderBy: {
				date: 'desc',
			},
		});

		/** Federal Nonfarm Minimum Hourly Wage */
		const federalNonfarmMinimumHourlyWageRecords: FederalNonfarmMinimumHourlyWage[] =
			await prisma.federalNonfarmMinimumHourlyWage.findMany({
				orderBy: {
					date: 'desc',
				},
			});

		return {
			success: true,
			result: {
				eggPriceRecords,
				medianCPIRecords,
				federalNonfarmMinimumHourlyWageRecords,
			},
		};
	},
};

export default EggsService;
