import dotenv from 'dotenv';

import type { FetchDataResponse } from '@/eggs/interface';

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
};

export default EggsService;
