import { prisma } from '@/eggs/database';

import type { CPIForAllUrbanConsumers } from '@prisma/client';

import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchFredSeriesObservationData } from '@/eggs/utilities/api/fetchFredSeriesObservationData';
import { getOrFetchFredSeriesRecord } from '@/eggs/utilities/api/getOrFetchFredSeriesRecord';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

export async function getOrFetchCPIForAllUrbanConsumersRecords(
	orderBy: 'asc' | 'desc' = 'desc',
): Promise<CPIForAllUrbanConsumers[]> {
	const cpiForAllUrbanConsumersFredSeriesRecord =
		await getOrFetchFredSeriesRecord('CPIAUCNS');

	if (
		cpiForAllUrbanConsumersFredSeriesRecord.lastDataFetch === null ||
		addOneMonthToDateString(
			cpiForAllUrbanConsumersFredSeriesRecord.lastDataFetch,
		) < new Date()
	) {
		const cpiForAllUrbanConsumersFredData =
			await fetchFredSeriesObservationData(
				cpiForAllUrbanConsumersFredSeriesRecord.id,
			);

		const existingCPIForAllUrbanConsumersRecordDateObjects = (
			await prisma.cPIForAllUrbanConsumers.findMany({
				select: { date: true },
			})
		).map(
			existingCPIForAllUrbanConsumersRecordDateObject =>
				existingCPIForAllUrbanConsumersRecordDateObject.date,
		);

		await prisma.$transaction([
			prisma.cPIForAllUrbanConsumers.createMany({
				data: cpiForAllUrbanConsumersFredData.filter(
					cpiForAllUrbanConsumersFredDataObject =>
						!existingCPIForAllUrbanConsumersRecordDateObjects.includes(
							cpiForAllUrbanConsumersFredDataObject.date,
						),
				),
				skipDuplicates: true,
			}),
			prisma.fredSeries.update({
				where: {
					id: cpiForAllUrbanConsumersFredSeriesRecord.id,
				},
				data: {
					lastDataFetch: formatDateCustom(new Date()),
				},
			}),
		]);
	}

	return await prisma.cPIForAllUrbanConsumers.findMany({
		orderBy: {
			date: orderBy,
		},
		where: {
			date: {
				gte: new Date('2009-08-01').toISOString(),
			},
		},
	});
}
