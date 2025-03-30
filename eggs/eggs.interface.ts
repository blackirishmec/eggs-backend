interface Data {
	date: string;
	value: number;
}

export interface DataResponse {
	/** Indicates if the request was successful */
	success: boolean;
	/** Error message if the request was not successful */
	message?: string;
	/** Data sets */
	result?: {
		eggPriceData: Data[];
		medianCPIData: Data[];
		federalNonfarmMinimumHourlyWageData: Data[];
	};
}
