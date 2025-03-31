import dotenv from 'dotenv';

import type {
	FetchDataResponse,
	GetMinimumEggsResponse,
} from '@/eggs/interface';

import { getOrFetchEggPriceRecords } from '@/eggs/utilities/api/getOrFetchEggPriceRecords';
import { getOrFetchFederalNonfarmMinimumHourlyWageRecords } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageRecords';
import { getOrFetchMedianCPIRecords } from '@/eggs/utilities/api/getOrFetchMedianCPIRecords';

const env = dotenv.config();
if (env.error) {
	throw env.error;
}

const EggsService = {
	fetchData: async (): Promise<FetchDataResponse> => {
		const eggPriceRecords = await getOrFetchEggPriceRecords();

		const medianCPIRecords = await getOrFetchMedianCPIRecords();

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

	getMinimumEggs: async (): Promise<GetMinimumEggsResponse> => {
		const eggPriceRecords = await getOrFetchEggPriceRecords();

		const medianCPIRecords = await getOrFetchMedianCPIRecords();

		const federalNonfarmMinimumHourlyWageRecords =
			await getOrFetchFederalNonfarmMinimumHourlyWageRecords();

		const mostRecentEggPriceRecord = eggPriceRecords[0];
		const mostRecentMedianCPIRecord = medianCPIRecords[0];
		const mostRecentFederalNonfarmMinimumHourlyWageRecord =
			federalNonfarmMinimumHourlyWageRecords[0];

		const mostRecentEggPrice = mostRecentEggPriceRecord.value / 12;
		const mostRecentFederalNonfarmMinimumHourlyWage =
			mostRecentFederalNonfarmMinimumHourlyWageRecord.value;
		const mostRecentEggsPerFederalNonfarmMinimumHourlyWage =
			mostRecentFederalNonfarmMinimumHourlyWage / mostRecentEggPrice;

		return {
			success: true,
			result: {
				minimumEggs: mostRecentEggsPerFederalNonfarmMinimumHourlyWage,
			},
		};
	},
};

export default EggsService;
