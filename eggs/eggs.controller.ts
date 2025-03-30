import { api, APIError } from 'encore.dev/api';

import type { DataResponse } from './eggs.interface';

import { sanitizeErrorString } from './utilities/sanitizeErrorString';

/**
 * Get Egg Price, Median CPI, and Federal Nonfarm Minimum Wage data.
 */
export const data = api(
	{ expose: true, method: 'GET', path: '/data' },
	async (): Promise<DataResponse> => {
		try {
			return await AQIService.readCityNames();
		} catch (error) {
			const errorString = sanitizeErrorString(error);
			throw APIError.aborted(errorString);
		}
	},
);
