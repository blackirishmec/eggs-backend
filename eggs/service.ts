import dotenv from 'dotenv';

import type {
	FetchDataResponse,
	GetCurrentMinimumEggsResponse,
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

	getCurrentMinimumEggs: async (): Promise<GetCurrentMinimumEggsResponse> => {
		const eggPriceRecords = await getOrFetchEggPriceRecords();

		const federalNonfarmMinimumHourlyWageRecords =
			await getOrFetchFederalNonfarmMinimumHourlyWageRecords();

		const mostRecentEggPriceRecord = eggPriceRecords[0];
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
