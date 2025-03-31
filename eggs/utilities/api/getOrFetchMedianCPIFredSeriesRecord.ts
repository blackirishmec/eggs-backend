import type { FredSeriesResponse } from '@/eggs/interface';
import type { FredSeries } from '@prisma/client';

import { axiosInstance } from '@/eggs/axiosInstance';
import { prisma } from '@/eggs/database';
import { transformFredSeriesResponse } from '@/eggs/transformers/transformFredSeriesResponse';

export async function getOrFetchMedianCPIFredSeries(): Promise<FredSeries> {
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

	return medianCPIFredSeriesRecord;
}
