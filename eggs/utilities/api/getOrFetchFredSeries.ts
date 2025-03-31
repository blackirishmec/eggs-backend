import { getOrFetchEggPriceFredSeries } from '@/eggs/utilities/api/getOrFetchEggPriceFredSeriesRecord';
import { getOrFetchFederalNonfarmMinimumHourlyWageFredSeriesRecord } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageFredSeriesRecord';
import { getOrFetchMedianCPIFredSeries } from '@/eggs/utilities/api/getOrFetchMedianCPIFredSeriesRecord';

export async function getOrFetchFredSeries() {
	/** Egg Price */
	const eggPriceFredSeriesRecord = await getOrFetchEggPriceFredSeries();

	/** Median CPI */
	const medianCPIFredSeriesRecord = await getOrFetchMedianCPIFredSeries();

	/** Federal Nonfarm Minimum Hourly Wage */
	const federalNonfarmMinimumHourlyWageFredSeriesRecord =
		await getOrFetchFederalNonfarmMinimumHourlyWageFredSeriesRecord();

	return {
		eggPriceFredSeriesRecord,
		medianCPIFredSeriesRecord,
		federalNonfarmMinimumHourlyWageFredSeriesRecord,
	};
}
