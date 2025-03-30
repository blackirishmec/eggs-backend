import dotenv from 'dotenv';

import type { FetchDataResponse } from '@/eggs/interface';
import type {
	EggPrice,
	FederalNonfarmMinimumHourlyWage,
	MedianCPI,
} from '@prisma/client';

import { prisma } from '@/eggs/database';
import { fetchFederalNonfarmMinimumHourlyWageFredData } from '@/eggs/utilities/api/fetchFederalNonfarmMinimumHourlyWageFredData';

const env = dotenv.config();
if (env.error) {
	throw env.error;
}

const EggsService = {
	// getData: async (): Promise<GetDataResponse> => {
	// const eggPrices = await prisma.eggPrice.

	// const cityStationIdRecord = await prisma.cityStationId.findFirst({
	// 	where: { cityName },
	// });
	// if (!cityStationIdRecord) {
	// 	return {
	// 		success: false,
	// 		message: 'cityStationIdRecord not found',
	// 	};
	// }
	// 	const cityNameRecords = await prisma.cityStationId.findMany({
	// 		select: {
	// 			cityName: true,
	// 		},
	// 	});
	// 	if (cityNameRecords.length === 0) {
	// 		return {
	// 			success: false,
	// 			message: 'cityNames not found',
	// 		};
	// 	}
	// 	return {
	// 		success: true,
	// 		result: cityNameRecords.map(
	// 			cityNameRecord => cityNameRecord.cityName,
	// 		),
	// 	};
	// },

	fetchData: async (): Promise<FetchDataResponse> => {
		/** Egg Prices */
		const eggPriceFredData =
			await fetchFederalNonfarmMinimumHourlyWageFredData();

		if (eggPriceFredData.length < 1) {
			return {
				success: false,
				message: 'Fetched eggPriceFredData empty!',
			};
		}

		const eggPriceRecords: EggPrice[] =
			await prisma.eggPrice.createManyAndReturn({
				data: eggPriceFredData,
			});

		/** Federal Nonfarm Minimum Hourly Wage */
		const federalNonfarmMinimumHourlyWageFredData =
			await fetchFederalNonfarmMinimumHourlyWageFredData();

		if (federalNonfarmMinimumHourlyWageFredData.length < 1) {
			return {
				success: false,
				message:
					'Fetched federalNonfarmMinimumHourlyWageFredData empty!',
			};
		}

		const federalNonfarmMinimumHourlyWageRecords: FederalNonfarmMinimumHourlyWage[] =
			await prisma.federalNonfarmMinimumHourlyWage.createManyAndReturn({
				data: federalNonfarmMinimumHourlyWageFredData,
			});

		/** Median CPI */
		const medianCPIFredData =
			await fetchFederalNonfarmMinimumHourlyWageFredData();

		if (medianCPIFredData.length < 1) {
			return {
				success: false,
				message: 'Fetched medianCPIFredData empty!',
			};
		}

		const medianCPIRecords: MedianCPI[] =
			await prisma.medianCPI.createManyAndReturn({
				data: medianCPIFredData,
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
