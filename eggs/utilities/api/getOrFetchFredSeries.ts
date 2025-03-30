import type { FredSeriesResponse } from '@/eggs/interface';

import { axiosInstance } from '@/eggs/axiosInstance';
import { prisma } from '@/eggs/database';
import { transformFredSeriesResponse } from '@/eggs/transformers/transformFredSeriesResponse';

export async function getOrFetchFredSeries() {
	/** Egg Price */
	let eggPriceFredSeriesRecord = await prisma.fredSeries.findFirst({
		where: {
			title: 'Average Price: Eggs, Grade A, Large (Cost per Dozen) in U.S. City Average',
		},
	});

	if (eggPriceFredSeriesRecord === null) {
		const eggPriceFredSeriesAxiosResponse =
			await axiosInstance.get<FredSeriesResponse>(
				`series?series_id=APU0000708111&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=2005-01-01`,
			);

		const eggPriceFredSeriesResponse = transformFredSeriesResponse(
			eggPriceFredSeriesAxiosResponse,
		);

		eggPriceFredSeriesRecord = await prisma.fredSeries.create({
			data: eggPriceFredSeriesResponse,
		});
	}

	/** Median CPI */
	let medianCPIFredSeriesRecord = await prisma.fredSeries.findFirst({
		where: {
			title: 'Median Consumer Price Index',
		},
	});

	if (medianCPIFredSeriesRecord === null) {
		const medianCPIFredSeriesAxiosResponse =
			await axiosInstance.get<FredSeriesResponse>(
				`series?series_id=MEDCPIM158SFRBCLE&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=2005-01-01`,
			);

		const medianCPIFredSeriesResponse = transformFredSeriesResponse(
			medianCPIFredSeriesAxiosResponse,
		);

		medianCPIFredSeriesRecord = await prisma.fredSeries.create({
			data: medianCPIFredSeriesResponse,
		});
	}

	/** Federal Nonfarm Minimum Hourly Wage */
	let federalNonfarmMinimumHourlyWageFredSeriesRecord =
		await prisma.fredSeries.findFirst({
			where: {
				title: 'Federal Minimum Hourly Wage for Nonfarm Workers for the United States',
			},
		});

	if (federalNonfarmMinimumHourlyWageFredSeriesRecord === null) {
		const federalNonfarmMinimumHourlyWageFredSeriesAxiosResponse =
			await axiosInstance.get<FredSeriesResponse>(
				`series?series_id=FEDMINNFRWG&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=2005-01-01`,
			);

		const federalNonfarmMinimumHourlyWageFredSeriesResponse =
			transformFredSeriesResponse(
				federalNonfarmMinimumHourlyWageFredSeriesAxiosResponse,
			);

		federalNonfarmMinimumHourlyWageFredSeriesRecord =
			await prisma.fredSeries.create({
				data: federalNonfarmMinimumHourlyWageFredSeriesResponse,
			});
	}

	return {
		eggPriceFredSeriesRecord,
		medianCPIFredSeriesRecord,
		federalNonfarmMinimumHourlyWageFredSeriesRecord,
	};
}
