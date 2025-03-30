import type { FredSeriesResponse } from '@/eggs/interface';
import type { FredSeries } from '@prisma/client';
import type { AxiosResponse } from 'axios';

export function transformFredSeriesResponse(
	fredSeriesResponse: AxiosResponse<FredSeriesResponse, unknown>,
): FredSeries {
	return {
		...fredSeriesResponse.data,
		lastUpdated: fredSeriesResponse.data.last_updated,
		lastDataFetch: null,
	};
}
