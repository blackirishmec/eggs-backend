import { prisma } from '@/eggs/database';
import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchFederalNonfarmMinimumHourlyWageFredData } from '@/eggs/utilities/api/fetchFederalNonfarmMinimumHourlyWageFredData';
import { getOrFetchFederalNonfarmMinimumHourlyWageFredSeriesRecord } from '@/eggs/utilities/api/getOrFetchFederalNonfarmMinimumHourlyWageFredSeriesRecord';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

export async function getOrFetchFederalNonfarmMinimumHourlyWageRecords() {
	const federalNonfarmMinimumHourlyWageFredSeriesRecord =
		await getOrFetchFederalNonfarmMinimumHourlyWageFredSeriesRecord();

	if (
		federalNonfarmMinimumHourlyWageFredSeriesRecord.lastDataFetch ===
			null ||
		addOneMonthToDateString(
			federalNonfarmMinimumHourlyWageFredSeriesRecord.lastDataFetch,
		) < new Date()
	) {
		const federalNonfarmMinimumHourlyWageFredData =
			await fetchFederalNonfarmMinimumHourlyWageFredData();

		await prisma.$transaction([
			prisma.federalNonfarmMinimumHourlyWage.createMany({
				data: federalNonfarmMinimumHourlyWageFredData,
			}),
			prisma.fredSeries.update({
				where: {
					id: federalNonfarmMinimumHourlyWageFredSeriesRecord.id,
				},
				data: {
					lastDataFetch: formatDateCustom(new Date()),
				},
			}),
		]);
	}

	return await prisma.federalNonfarmMinimumHourlyWage.findMany({
		orderBy: {
			date: 'desc',
		},
	});
}
