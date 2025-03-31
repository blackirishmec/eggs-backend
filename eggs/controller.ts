import { api, APIError } from 'encore.dev/api';

import type {
	FetchDataResponse,
	GetCurrentMinimumEggsResponse,
} from '@/eggs/interface';

import EggsService from '@/eggs/service';
import { sanitizeErrorString } from '@/eggs/utilities/sanitizeErrorString';

/**
 * Get Egg Price, Median CPI, and Federal Nonfarm Minimum Wage data.
 */
export const data = api(
	{ expose: true, method: 'GET', path: '/data' },
	async (): Promise<FetchDataResponse> => {
		try {
			return await EggsService.fetchData();
		} catch (error) {
			const errorString = sanitizeErrorString(error);
			throw APIError.aborted(errorString);
		}
	},
);

/**
 * Get the current number of eggs equal to the current US Federal Nonfarm Minimum Wage, adjusted for inflation.
 */
export const minimumEggs = api(
	{ expose: true, method: 'GET', path: '/minimum-eggs' },
	async (): Promise<GetCurrentMinimumEggsResponse> => {
		try {
			return await EggsService.getCurrentMinimumEggs();
		} catch (error) {
			const errorString = sanitizeErrorString(error);
			throw APIError.aborted(errorString);
		}
	},
);
