import type { MinimumEggsTrendDataObject } from '@/eggs/interface';

import { getOrFetchCPIForAllUrbanConsumersRecords } from '@/eggs/utilities/api/getOrFetchCPIForAllUrbanConsumersRecords';
import { getOrFetchEggPriceRecords } from '@/eggs/utilities/api/getOrFetchEggPriceRecords';
import { getOrFetchFederalNonfarmMinimumHourlyWageRecords } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageRecords';

export async function getMinimumEggsTrendData(
	adjusted: boolean = false,
): Promise<MinimumEggsTrendDataObject[]> {
	const eggPriceRecords = await getOrFetchEggPriceRecords('asc');
	const federalNonfarmMinimumHourlyWageRecords =
		await getOrFetchFederalNonfarmMinimumHourlyWageRecords('asc');
	const cPIForAllUrbanConsumersRecords =
		await getOrFetchCPIForAllUrbanConsumersRecords('asc');

	const federalNonfarmMinimumHourlyWagePerMonthMap = new Map<string, number>(
		federalNonfarmMinimumHourlyWageRecords.map(
			federalNonfarmMinimumHourlyWageRecord => [
				federalNonfarmMinimumHourlyWageRecord.date,
				federalNonfarmMinimumHourlyWageRecord.value,
			],
		),
	);

	const cPIForAllUrbanConsumersPerMonthMap = new Map<string, number>(
		cPIForAllUrbanConsumersRecords.map(cPIForAllUrbanConsumersRecord => [
			cPIForAllUrbanConsumersRecord.date,
			cPIForAllUrbanConsumersRecord.value,
		]),
	);

	const currentCPIForAllUrbanConsumersRecord =
		cPIForAllUrbanConsumersRecords[0];

	return eggPriceRecords.map(eggPriceRecordForMonth => {
		let federalNonfarmMinimumHourlyWageForMonth =
			federalNonfarmMinimumHourlyWagePerMonthMap.get(
				eggPriceRecordForMonth.date,
			);

		if (federalNonfarmMinimumHourlyWageForMonth === undefined) {
			throw new Error(
				`Missing federalNonfarmMinimumHourlyWageForMonth data for date ${eggPriceRecordForMonth.date}`,
			);
		}
		if (federalNonfarmMinimumHourlyWageForMonth === 0) {
			throw new Error(
				`Division by zero for date ${eggPriceRecordForMonth.date}`,
			);
		}

		const cPIForAllUrbanConsumersPerMonth =
			cPIForAllUrbanConsumersPerMonthMap.get(eggPriceRecordForMonth.date);

		if (cPIForAllUrbanConsumersPerMonth === undefined) {
			throw new Error(
				`Missing cPIForAllUrbanConsumersPerMonth data for date ${eggPriceRecordForMonth.date}`,
			);
		}

		const eggPriceForMonth = eggPriceRecordForMonth.value / 12;

		if (adjusted === true) {
			federalNonfarmMinimumHourlyWageForMonth =
				federalNonfarmMinimumHourlyWageForMonth *
				(currentCPIForAllUrbanConsumersRecord.value /
					cPIForAllUrbanConsumersPerMonth);
		}

		return {
			date: eggPriceRecordForMonth.date,
			value: federalNonfarmMinimumHourlyWageForMonth / eggPriceForMonth,
		};
	});
}
