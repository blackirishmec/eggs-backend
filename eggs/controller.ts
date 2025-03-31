import { api, APIError } from 'encore.dev/api';

import type {
	FetchDataResponse,
	GetCurrentMinimumEggsResponse,
	GetMinimumEggsTrendDataResponse,
	MinimumEggsTrendDataParams,
} from '@/eggs/interface';

import EggsService from '@/eggs/service';
import { sanitizeErrorString } from '@/eggs/utilities/sanitizeErrorString';

/**
 * Get Egg Price, CPI For All Urban Consumers, and Federal Nonfarm Minimum Wage data.
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
 * Get the current number of eggs equal to the current US Federal Nonfarm Minimum Wage.
 */
export const currentMinimumEggs = api(
	{ expose: true, method: 'GET', path: '/current-minimum-eggs' },
	async (): Promise<GetCurrentMinimumEggsResponse> => {
		try {
			return await EggsService.getCurrentMinimumEggs();
		} catch (error) {
			const errorString = sanitizeErrorString(error);
			throw APIError.aborted(errorString);
		}
	},
);

/**
 * Get the data set of the trend of number of eggs equal to the current US Federal Nonfarm Minimum Wage, optionally adjusted for inflation.
 */
export const minimumEggsTrendData = api(
	{ expose: true, method: 'GET', path: '/minimum-eggs-trend-data' },
	async ({
		ADJUSTED = false,
	}: MinimumEggsTrendDataParams): Promise<GetMinimumEggsTrendDataResponse> => {
		try {
			return await EggsService.getMinimumEggsTrendData(ADJUSTED);
		} catch (error) {
			const errorString = sanitizeErrorString(error);
			throw APIError.aborted(errorString);
		}
	},
);
