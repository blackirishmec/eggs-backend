/**
 * Returns a new Date object representing one month after the given date string.
 *
 * @param dateStr - A date string (e.g. "2025-02-28 14:01:02-06")
 * @returns A Date object one month in the future
 */
export function addOneMonthToDateString(dateStr: string): Date {
	// Create the original Date. (Ensure the format is reliably parsed—ISO 8601 is best.)
	const originalDate = new Date(dateStr);
	// Clone the date to avoid mutating the original
	const newDate = new Date(originalDate.getTime());
	// Add one month
	newDate.setMonth(newDate.getMonth() + 1);
	return newDate;
}
