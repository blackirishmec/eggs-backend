import type { FredSeriesResponse } from '@/eggs/interface';
import type { FredSeries } from '@prisma/client';

import { axiosInstance } from '@/eggs/axiosInstance';
import { prisma } from '@/eggs/database';
import { transformFredSeriesResponse } from '@/eggs/transformers/transformFredSeriesResponse';

export async function getOrFetchFederalNonfarmMinimumHourlyWageFredSeriesRecord(): Promise<FredSeries> {
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

	return federalNonfarmMinimumHourlyWageFredSeriesRecord;
}
