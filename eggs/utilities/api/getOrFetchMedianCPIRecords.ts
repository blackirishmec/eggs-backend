import { prisma } from '@/eggs/database';

import type { MedianCPI } from '@prisma/client';

import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchFredSeriesObservationData } from '@/eggs/utilities/api/fetchFredSeriesObservationData';
import { getOrFetchFredSeriesRecord } from '@/eggs/utilities/api/getOrFetchFredSeriesRecord';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

export async function getOrFetchMedianCPIRecords(): Promise<MedianCPI[]> {
	const medianCPIFredSeriesRecord =
		await getOrFetchFredSeriesRecord('MEDCPIM158SFRBCLE');

	if (
		medianCPIFredSeriesRecord.lastDataFetch === null ||
		addOneMonthToDateString(medianCPIFredSeriesRecord.lastDataFetch) <
			new Date()
	) {
		const medianCPIFredData = await fetchFredSeriesObservationData(
			medianCPIFredSeriesRecord.id,
		);

		const existingMedianCPIRecordDateObjects = (
			await prisma.medianCPI.findMany({
				select: { date: true },
			})
		).map(
			existingMedianCPIRecordDateObject =>
				existingMedianCPIRecordDateObject.date,
		);

		await prisma.$transaction([
			prisma.medianCPI.createMany({
				data: medianCPIFredData.filter(
					medianCPIFredDataObject =>
						!existingMedianCPIRecordDateObjects.includes(
							medianCPIFredDataObject.date,
						),
				),
				skipDuplicates: true,
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
