import type { FredSeriesObservationsResponse } from '@/eggs/interface';

import { axiosInstance } from '@/eggs/axiosInstance';
import { transformFredSeriesObservationResponse } from '@/eggs/transformers/transformFredSeriesObservationResponse';

export async function fetchFredSeriesObservationData(seriesId: string) {
	const fredSeriesObservationResponse =
		await axiosInstance.get<FredSeriesObservationsResponse>(
			`series/observations?series_id=${seriesId}&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=2005-01-01`,
		);

	const fredSeriesObservationData = transformFredSeriesObservationResponse(
		fredSeriesObservationResponse,
	);

	return fredSeriesObservationData;
}
