import dotenv from 'dotenv';

import type { FetchDataResponse } from '@/eggs/interface';

import { prisma } from '@/eggs/database';
import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchFederalNonfarmMinimumHourlyWageFredData } from '@/eggs/utilities/api/fetchFederalNonfarmMinimumHourlyWageFredData';
import { getOrFetchEggPriceRecords } from '@/eggs/utilities/api/getOrFetchEggPriceRecords';
import { getOrFetchFederalNonfarmMinimumHourlyWageRecords } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageRecords';
import { getOrFetchFredSeries } from '@/eggs/utilities/api/getOrFetchFredSeries';
import { getOrFetchMedianCPIRecords } from '@/eggs/utilities/api/getOrFetchMedianCPIRecords';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

const env = dotenv.config();
if (env.error) {
	throw env.error;
}

const EggsService = {
	fetchData: async (): Promise<FetchDataResponse> => {
		/** Get or Fetch Fred Series */
		const { federalNonfarmMinimumHourlyWageFredSeriesRecord } =
			await getOrFetchFredSeries();

		/** Update DB via API Fetch */
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
		const eggPriceRecords = await getOrFetchEggPriceRecords();

		/** Median CPI */
		const medianCPIRecords = await getOrFetchMedianCPIRecords();

		/** Federal Nonfarm Minimum Hourly Wage */
		const federalNonfarmMinimumHourlyWageRecords =
			await getOrFetchFederalNonfarmMinimumHourlyWageRecords();

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
