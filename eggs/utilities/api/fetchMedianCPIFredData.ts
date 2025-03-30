import type { FredSeriesObservationsResponse } from '@/eggs/interface';

import { axiosInstance } from '@/eggs/axiosInstance';
import { transformFredSeriesObservationResponse } from '@/eggs/transformers/transformFredSeriesObservationResponse';

export async function fetchMedianCPIFredData() {
	const medianCPIResponse =
		await axiosInstance.get<FredSeriesObservationsResponse>(
			`series/observations?series_id=MEDCPIM158SFRBCLE&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=2005-01-01`,
		);

	const medianCPIFredData =
		transformFredSeriesObservationResponse(medianCPIResponse);

	return medianCPIFredData;
}
