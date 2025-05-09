import type { Query } from 'encore.dev/api';

export interface FredSeries {
	id?: string;
	createdAt?: Date;
	updatedAt?: Date;
	title: string;
	frequency: string;
	units: string;
	lastUpdated: string;
}

export interface EggPrice {
	id?: number;
	date: string;
	value: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface MedianCPI {
	id?: number;
	date: string;
	value: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface CPIForAllUrbanConsumers {
	id?: number;
	date: string;
	value: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface FederalNonfarmMinimumHourlyWage {
	id?: number;
	date: string;
	value: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface FredData {
	date: string;
	value: string;
}

export interface FetchDataResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** Data sets */
	result?: {
		eggPriceRecords: EggPrice[];
		cPIForAllUrbanConsumersRecords: CPIForAllUrbanConsumers[];
		federalNonfarmMinimumHourlyWageRecords: FederalNonfarmMinimumHourlyWage[];
	};
}

export interface GetCurrentMinimumEggsResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** The current number of eggs equal to the current US Federal Nonfarm Minimum Wage, adjusted for inflation */
	result?: {
		minimumEggs: number;
	};
}

export interface MinimumEggsTrendDataObject {
	date: string;
	value: number;
}

export interface GetMinimumEggsTrendDataResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** The data set of the trend of number of eggs equal to the current US Federal Nonfarm Minimum Wage, adjusted for inflation */
	result?: {
		minimumEggsTrendData: MinimumEggsTrendDataObject[];
	};
}

export interface GetDataResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** Data sets */
	result?: {
		eggPriceData: FredData[];
		cPIForAllUrbanConsumersRecords: FredData[];
		federalNonfarmMinimumHourlyWageData: FredData[];
	};
}

export interface FredSeriesObservationsResponse {
	observations: FredData[];
}

export interface FredSeriesResponse {
	seriess: {
		id: string;
		title: string;
		frequency: string;
		units: string;
		last_updated: string;
	}[];
}

export interface MinimumEggsTrendDataParams {
	/** The flag for adjusting trend data by inflation using CPI For All Urban Consumers */
	ADJUSTED?: Query<boolean>;
}
