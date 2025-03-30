import type {
	FredData,
	FredSeriesObservationsResponse,
} from '@/eggs/interface';
import type { AxiosResponse } from 'axios';

export function transformFredSeriesObservationResponse(
	fredSeriesObservationResponse: AxiosResponse<
		FredSeriesObservationsResponse,
		unknown
	>,
): FredData[] {
	return fredSeriesObservationResponse.data.observations;
}
