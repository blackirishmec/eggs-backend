import { prisma } from '@/eggs/database';

import type { MedianCPI } from '@prisma/client';

import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchFederalNonfarmMinimumHourlyWageFredData } from '@/eggs/utilities/api/fetchFederalNonfarmMinimumHourlyWageFredData';
import { getOrFetchMedianCPIFredSeries } from '@/eggs/utilities/api/getOrFetchMedianCPIFredSeriesRecord';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

export async function getOrFetchMedianCPIRecords(): Promise<MedianCPI[]> {
	const medianCPIFredSeriesRecord = await getOrFetchMedianCPIFredSeries();

	if (
		medianCPIFredSeriesRecord.lastDataFetch === null ||
		addOneMonthToDateString(medianCPIFredSeriesRecord.lastDataFetch) <
			new Date()
	) {
		const medianCPIFredData =
			await fetchFederalNonfarmMinimumHourlyWageFredData();

		await prisma.$transaction([
			prisma.medianCPI.createMany({
				data: medianCPIFredData,
			}),
			prisma.fredSeries.update({
				where: {
					id: medianCPIFredSeriesRecord.id,
				},
				data: {
					lastDataFetch: formatDateCustom(new Date()),
				},
			}),
		]);
	}

	return await prisma.medianCPI.findMany({
		orderBy: {
			date: 'desc',
		},
	});
}
