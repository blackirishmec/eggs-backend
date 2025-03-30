import type { FredSeriesObservationsResponse } from '@/eggs/interface';

import { axiosInstance } from '@/eggs/axiosInstance';
import { transformFredSeriesObservationResponse } from '@/eggs/transformers/transformFredSeriesObservationResponse';

export async function fetchFederalNonfarmMinimumHourlyWageFredData() {
	const federalNonfarmMinimumHourlyWageResponse =
		await axiosInstance.get<FredSeriesObservationsResponse>(
			`series/observations?series_id=FEDMINNFRWG&api_key=${process.env.FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=2005-01-01`,
		);

	const federalNonfarmMinimumHourlyWageFredData =
		transformFredSeriesObservationResponse(
			federalNonfarmMinimumHourlyWageResponse,
		);

	return federalNonfarmMinimumHourlyWageFredData;
}
