export const formatNumber = (value?: number) =>
	new Intl.NumberFormat().format(value ?? 0);

export const formatDateTime = (value?: string) => {
	if (!value) return '—';
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export const formatDuration = (seconds?: number) => {
	if (!seconds) return '—';
	if (seconds < 60) return `${Math.round(seconds)}s`;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);
	return `${minutes}m ${remainingSeconds}s`;
};
