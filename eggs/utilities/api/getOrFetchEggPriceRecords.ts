import type { EggPrice } from '@prisma/client';

import { prisma } from '@/eggs/database';
import { addOneMonthToDateString } from '@/eggs/utilities/addOneMonthToDateString';
import { fetchEggPriceFredData } from '@/eggs/utilities/api/fetchEggPriceFredData';
import { getOrFetchEggPriceFredSeries } from '@/eggs/utilities/api/getOrFetchEggPriceFredSeriesRecord';
import { formatDateCustom } from '@/eggs/utilities/formatDateCustom';

export async function getOrFetchEggPriceRecords(): Promise<EggPrice[]> {
	const eggPriceFredSeriesRecord = await getOrFetchEggPriceFredSeries();

	if (
		eggPriceFredSeriesRecord.lastDataFetch === null ||
		addOneMonthToDateString(eggPriceFredSeriesRecord.lastDataFetch) <
			new Date()
	) {
		const eggPriceFredData = await fetchEggPriceFredData();

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

	const eggPriceRecords = await prisma.eggPrice.findMany({
		orderBy: {
			date: 'desc',
		},
	});

	if (eggPriceRecords === undefined) {
		return [];
	}

	return eggPriceRecords;
}
