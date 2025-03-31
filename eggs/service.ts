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

	getLastFederalNonfarmMinimumWageUpdateMinimumEggs:
		async (): Promise<GetCurrentMinimumEggsResponse> => {
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

			const lastFederalMinimumWageHikeDateString = '2009-09-01';

			const lastMinimumWageHikeCPIForAllUrbanConsumersRecord =
				cPIForAllUrbanConsumersRecords.find(
					cPIForAllUrbanConsumersRecord =>
						cPIForAllUrbanConsumersRecord.date ===
						lastFederalMinimumWageHikeDateString,
				);
			if (
				lastMinimumWageHikeCPIForAllUrbanConsumersRecord === undefined
			) {
				return {
					success: false,
					message:
						'lastMinimumWageHikeCPIForAllUrbanConsumersRecord must be defined!',
				};
			}

			const lastMinimumWageHikeFederalNonfarmMinimumWageRecord =
				federalNonfarmMinimumHourlyWageRecords.find(
					federalNonfarmMinimumHourlyWageRecord =>
						federalNonfarmMinimumHourlyWageRecord.date ===
						lastFederalMinimumWageHikeDateString,
				);
			if (
				lastMinimumWageHikeFederalNonfarmMinimumWageRecord === undefined
			) {
				return {
					success: false,
					message:
						'lastMinimumWageHikeFederalNonfarmMinimumWageRecord must be defined!',
				};
			}

			const adjustedMostRecentEggsPerFederalNonfarmMinimumHourlyWage =
				lastMinimumWageHikeFederalNonfarmMinimumWageRecord.value *
				(mostRecentCPIForAllUrbanConsumersRecord.value /
					lastMinimumWageHikeCPIForAllUrbanConsumersRecord.value);

			return {
				success: true,
				result: {
					minimumEggs:
						mostRecentEggsPerFederalNonfarmMinimumHourlyWage,
				},
			};
		},
};

export default EggsService;
