import { prisma } from '@/eggs/database';

import type { FredSeriesResponse } from '@/eggs/interface';
import type { FredSeries } from '@prisma/client';

import { axiosInstance } from '@/eggs/axiosInstance';
import { transformFredSeriesResponse } from '@/eggs/transformers/transformFredSeriesResponse';

export async function getOrFetchFredSeriesRecord(
	fredSeriesId: string,
): Promise<FredSeries> {
	let fredSeriesRecord = await prisma.fredSeries.findFirst({
		where: {
			id: fredSeriesId,
		},
	});

	if (fredSeriesRecord === null) {
		const fredSeriesAxiosResponse =
			await axiosInstance.get<FredSeriesResponse>(
				`series?series_id=${fredSeriesId}&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=2009-09-01`,
			);

		const fredSeriesResponse = transformFredSeriesResponse(
			fredSeriesAxiosResponse,
		);

		fredSeriesRecord = await prisma.fredSeries.create({
			data: fredSeriesResponse,
		});
	}

	return fredSeriesRecord;
}
