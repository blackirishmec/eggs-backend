import type { FredSeriesResponse } from '@/eggs/interface';
import type { FredSeries } from '@prisma/client';
import type { AxiosResponse } from 'axios';

export function transformFredSeriesResponse(
	fredSeriesResponse: AxiosResponse<FredSeriesResponse, unknown>,
): FredSeries {
	const responseObject = fredSeriesResponse.data.seriess[0];

	return {
		id: responseObject.id,
		title: responseObject.title,
		frequency: responseObject.frequency,
		units: responseObject.units,
		lastUpdated: responseObject.last_updated,
		lastDataFetch: null,
	};
}
