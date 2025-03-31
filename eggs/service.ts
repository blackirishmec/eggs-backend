import dotenv from 'dotenv';

import type {
	FetchDataResponse,
	GetCurrentMinimumEggsResponse,
	GetMinimumEggsTrendDataResponse,
} from '@/eggs/interface';

import { getOrFetchCPIForAllUrbanConsumersRecords } from '@/eggs/utilities/api/getOrFetchCPIForAllUrbanConsumersRecords';
import { getOrFetchEggPriceRecords } from '@/eggs/utilities/api/getOrFetchEggPriceRecords';
import { getOrFetchFederalNonfarmMinimumHourlyWageRecords } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageRecords';
import { getMinimumEggsByMonth } from '@/eggs/utilities/getMinimumEggsByMonth';
import { getMinimumEggsTrendData } from '@/eggs/utilities/getMinimumEggsTrendData';

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

	getCurrentMinimumEggs: async (): Promise<GetCurrentMinimumEggsResponse> => {
		const eggPriceRecords = await getOrFetchEggPriceRecords();

		const mostRecentEggPriceRecordDate = eggPriceRecords[0].date;
		const mostRecentEggsPerFederalNonfarmMinimumHourlyWage =
			await getMinimumEggsByMonth(mostRecentEggPriceRecordDate);

		if (mostRecentEggsPerFederalNonfarmMinimumHourlyWage === undefined)
			return {
				success: false,
				message:
					'mostRecentEggsPerFederalNonfarmMinimumHourlyWage is undefined',
			};

		return {
			success: true,
			result: {
				minimumEggs: mostRecentEggsPerFederalNonfarmMinimumHourlyWage,
			},
		};
	},

	getMinimumEggsTrendData: async (
		ADJUSTED: boolean = false,
	): Promise<GetMinimumEggsTrendDataResponse> => {
		const minimumEggsTrendData = await getMinimumEggsTrendData(ADJUSTED);

		return {
			success: true,
			result: {
				minimumEggsTrendData,
			},
		};
	},
};

export default EggsService;
