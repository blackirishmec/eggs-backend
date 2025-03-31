import type { FredSeriesResponse } from '@/eggs/interface';
import type { FredSeries } from '@prisma/client';

import { axiosInstance } from '@/eggs/axiosInstance';
import { prisma } from '@/eggs/database';
import { transformFredSeriesResponse } from '@/eggs/transformers/transformFredSeriesResponse';

export async function getOrFetchEggPriceFredSeries(): Promise<FredSeries> {
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

	return eggPriceFredSeriesRecord;
}
