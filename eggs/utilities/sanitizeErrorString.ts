export function sanitizeErrorString(error: unknown) {
	return error !== undefined && error !== null
		? (error as string)
		: ('Error fetching data' as string);
}
