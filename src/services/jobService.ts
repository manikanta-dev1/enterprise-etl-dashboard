import api from './api';

export type JobStatus = 'success' | 'running' | 'failed' | 'queued';

export interface Job {
	id: string | number;
	pipelineId?: string | number;
	pipelineName: string;
	status: JobStatus;
	startedAt?: string;
	finishedAt?: string;
	durationSeconds?: number;
	recordsProcessed?: number;
	errorMessage?: string;
}

type JobApiItem = Record<string, unknown>;

const toStatus = (value: unknown): JobStatus => {
	const status = String(value ?? 'queued').toLowerCase();
	if (status === 'completed' || status === 'succeeded') return 'success';
	return ['success', 'running', 'failed', 'queued'].includes(status)
		? (status as JobStatus)
		: 'queued';
};

const toJob = (item: JobApiItem, index: number): Job => ({
	id: (item.id ?? item.job_id ?? index) as string | number,
	pipelineId: (item.pipeline_id ?? item.pipelineId) as string | number | undefined,
	pipelineName: String(item.pipeline_name ?? item.pipelineName ?? item.pipeline ?? 'Unknown pipeline'),
	status: toStatus(item.status),
	startedAt: item.started_at || item.start_time ? String(item.started_at ?? item.start_time) : undefined,
	finishedAt: item.finished_at || item.end_time ? String(item.finished_at ?? item.end_time) : undefined,
	durationSeconds: Number(item.duration_seconds ?? item.duration ?? 0),
	recordsProcessed: Number(item.records_processed ?? item.recordsProcessed ?? 0),
	errorMessage: item.error_message || item.error ? String(item.error_message ?? item.error) : undefined,
});

const extractItems = (data: unknown): JobApiItem[] => {
	if (Array.isArray(data)) return data as JobApiItem[];
	if (data && typeof data === 'object') {
		const payload = data as Record<string, unknown>;
		const items = payload.items ?? payload.jobs ?? payload.data;
		if (Array.isArray(items)) return items as JobApiItem[];
	}
	return [];
};

export const getJobs = async (signal?: AbortSignal): Promise<Job[]> => {
	const response = await api.get('/jobs', { signal });
	return extractItems(response.data).map(toJob);
};

export const getJob = async (id: string | number): Promise<Job> => {
	const response = await api.get(`/jobs/${id}`);
	return toJob(response.data as JobApiItem, 0);
};
