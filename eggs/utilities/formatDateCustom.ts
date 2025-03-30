/**
 * Formats a Date object as "YYYY-MM-DD HH:mm:ss±HH".
 * @param date A JavaScript Date instance.
 * @returns A formatted date string.
 */
export function formatDateCustom(date: Date): string {
	// Helper to pad single-digit numbers with a leading zero.
	const pad = (n: number): string => n.toString().padStart(2, '0');

	// Extract the date and time components.
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1); // months are zero-indexed
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	// Compute the timezone offset.
	// getTimezoneOffset() returns the offset in minutes from local time to UTC.
	// For example, if local time is UTC-6, getTimezoneOffset() returns 360.
	// We invert the sign for display: positive offset minutes mean local time is behind UTC.
	const offsetMinutes = date.getTimezoneOffset();
	const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
	const offsetSign = offsetMinutes > 0 ? '-' : '+';
	const tz = `${offsetSign}${pad(offsetHours)}`;

	// Combine parts into the target format.
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${tz}`;
}
