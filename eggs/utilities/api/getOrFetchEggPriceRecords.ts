import { prisma } from '@/eggs/database';

import type { EggPrice } from '@prisma/client';

import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchFredSeriesObservationData } from '@/eggs/utilities/api/fetchFredSeriesObservationData';
import { getOrFetchFredSeriesRecord } from '@/eggs/utilities/api/getOrFetchFredSeriesRecord';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

export async function getOrFetchEggPriceRecords(
	orderBy: 'asc' | 'desc' = 'desc',
): Promise<EggPrice[]> {
	const eggPriceFredSeriesRecord =
		await getOrFetchFredSeriesRecord('APU0000708111');

	if (
		eggPriceFredSeriesRecord.lastDataFetch === null ||
		addOneMonthToDateString(eggPriceFredSeriesRecord.lastDataFetch) <
			new Date()
	) {
		const eggPriceFredData = await fetchFredSeriesObservationData(
			eggPriceFredSeriesRecord.id,
		);

		const existingEggPriceRecordDateObjects = (
			await prisma.eggPrice.findMany({
				select: { date: true },
			})
		).map(
			existingEggPriceRecordDateObject =>
				existingEggPriceRecordDateObject.date,
		);

		await prisma.$transaction([
			prisma.eggPrice.createMany({
				data: eggPriceFredData.filter(
					eggPriceFredDataObject =>
						!existingEggPriceRecordDateObjects.includes(
							eggPriceFredDataObject.date,
						),
				),
				skipDuplicates: true,
			}),
			prisma.fredSeries.update({
				where: {
					id: eggPriceFredSeriesRecord.id,
				},
				data: {
					lastDataFetch: formatDateCustom(new Date()),
				},
			}),
		]);
	}

	return await prisma.eggPrice.findMany({
		orderBy: {
			date: orderBy,
		},
	});
}
