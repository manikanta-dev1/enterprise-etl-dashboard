import api from './api';

export interface Metrics {
	totalPipelines: number;
	activePipelines: number;
	totalJobs: number;
	runningJobs: number;
	failedJobs: number;
	successRate: number;
	recordsProcessed: number;
	throughputPerMinute: number;
	averageDurationSeconds: number;
}

const numberValue = (data: Record<string, unknown>, ...keys: string[]) => {
	const value = keys.map((key) => data[key]).find((entry) => entry !== undefined);
	const parsed = Number(value ?? 0);
	return Number.isFinite(parsed) ? parsed : 0;
};

const toMetrics = (payload: unknown): Metrics => {
	const outer = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
	const data = outer.metrics && typeof outer.metrics === 'object'
		? (outer.metrics as Record<string, unknown>)
		: outer;

	return {
		totalPipelines: numberValue(data, 'total_pipelines', 'totalPipelines'),
		activePipelines: numberValue(data, 'active_pipelines', 'activePipelines'),
		totalJobs: numberValue(data, 'total_jobs', 'totalJobs'),
		runningJobs: numberValue(data, 'running_jobs', 'runningJobs'),
		failedJobs: numberValue(data, 'failed_jobs', 'failedJobs'),
		successRate: numberValue(data, 'success_rate', 'successRate'),
		recordsProcessed: numberValue(data, 'records_processed', 'recordsProcessed'),
		throughputPerMinute: numberValue(data, 'throughput_per_minute', 'throughputPerMinute', 'throughput'),
		averageDurationSeconds: numberValue(data, 'average_duration_seconds', 'averageDurationSeconds', 'avg_duration'),
	};
};

export const getMetrics = async (signal?: AbortSignal): Promise<Metrics> => {
	const response = await api.get('/metrics', { signal });
	return toMetrics(response.data);
};
