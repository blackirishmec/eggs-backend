import { prisma } from '@/eggs/database';

import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchFredSeriesObservationData } from '@/eggs/utilities/api/fetchFredSeriesObservationData';
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
			await fetchFredSeriesObservationData(
				federalNonfarmMinimumHourlyWageFredSeriesRecord.id,
			);

		const existingFederalNonfarmMinimumHourlyWageRecordDateObjects = (
			await prisma.federalNonfarmMinimumHourlyWage.findMany({
				select: { date: true },
			})
		).map(
			existingFederalNonfarmMinimumHourlyWageRecordDateObject =>
				existingFederalNonfarmMinimumHourlyWageRecordDateObject.date,
		);

		await prisma.$transaction([
			prisma.federalNonfarmMinimumHourlyWage.createMany({
				data: federalNonfarmMinimumHourlyWageFredData.filter(
					federalNonfarmMinimumHourlyWageFredDataObject =>
						!existingFederalNonfarmMinimumHourlyWageRecordDateObjects.includes(
							federalNonfarmMinimumHourlyWageFredDataObject.date,
						),
				),
				skipDuplicates: true,
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
