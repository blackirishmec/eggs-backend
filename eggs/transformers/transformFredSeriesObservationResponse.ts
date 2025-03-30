import type { FredSeriesObservationsResponse } from '@/eggs/interface';
import type { AxiosResponse } from 'axios';

export function transformFredSeriesObservationResponse(
	fredSeriesObservationResponse: AxiosResponse<
		FredSeriesObservationsResponse,
		unknown
	>,
): { date: string; value: number }[] {
	return fredSeriesObservationResponse.data.observations.map(obs => ({
		date: obs.date,
		value: parseFloat(obs.value),
	}));
}
