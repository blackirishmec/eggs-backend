import { getOrFetchEggPriceRecords } from '@/eggs/utilities/api/getOrFetchEggPriceRecords';
import { getOrFetchFederalNonfarmMinimumHourlyWageRecords } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageRecords';

export async function getMinimumEggsByMonth(monthDateString: string) {
	const eggPriceRecords = await getOrFetchEggPriceRecords();

	const federalNonfarmMinimumHourlyWageRecords =
		await getOrFetchFederalNonfarmMinimumHourlyWageRecords();

	const eggPriceRecordForMonth = eggPriceRecords.find(
		eggPriceRecord => eggPriceRecord.date === monthDateString,
	);
	if (eggPriceRecordForMonth === undefined) return undefined;

	const federalNonfarmMinimumHourlyWageRecordForMonth =
		federalNonfarmMinimumHourlyWageRecords.find(
			federalNonfarmMinimumHourlyWageRecord =>
				federalNonfarmMinimumHourlyWageRecord.date === monthDateString,
		);
	if (federalNonfarmMinimumHourlyWageRecordForMonth === undefined)
		return undefined;

	const eggPriceForMonth = eggPriceRecordForMonth.value / 12;
	const federalNonfarmMinimumHourlyWageForMonth =
		federalNonfarmMinimumHourlyWageRecordForMonth.value;

	return federalNonfarmMinimumHourlyWageForMonth / eggPriceForMonth;
}
