import dotenv from 'dotenv';

import type {
	FetchDataResponse,
	GetMinimumEggsResponse,
} from '@/eggs/interface';

import { getOrFetchCPIForAllUrbanConsumersRecords } from '@/eggs/utilities/api/getOrFetchCPIForAllUrbanConsumersRecords';
import { getOrFetchEggPriceRecords } from '@/eggs/utilities/api/getOrFetchEggPriceRecords';
import { getOrFetchFederalNonfarmMinimumHourlyWageRecords } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageRecords';

const env = dotenv.config();
if (env.error) {
	throw env.error;
}

const EggsService = {
	fetchData: async (): Promise<FetchDataResponse> => {
		const eggPriceRecords = await getOrFetchEggPriceRecords();

		const cPIForAllUrbanConsumersRecords =
			await getOrFetchCPIForAllUrbanConsumersRecords();

		const federalNonfarmMinimumHourlyWageRecords =
			await getOrFetchFederalNonfarmMinimumHourlyWageRecords();

		return {
			success: true,
			result: {
				eggPriceRecords,
				cPIForAllUrbanConsumersRecords,
				federalNonfarmMinimumHourlyWageRecords,
			},
		};
	},

	getMinimumEggs: async (): Promise<GetMinimumEggsResponse> => {
		const eggPriceRecords = await getOrFetchEggPriceRecords();

		const cPIForAllUrbanConsumersRecords =
			await getOrFetchCPIForAllUrbanConsumersRecords();

		const federalNonfarmMinimumHourlyWageRecords =
			await getOrFetchFederalNonfarmMinimumHourlyWageRecords();

		const mostRecentEggPriceRecord = eggPriceRecords[0];
		const mostRecentCPIForAllUrbanConsumersRecord =
			cPIForAllUrbanConsumersRecords[0];
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
