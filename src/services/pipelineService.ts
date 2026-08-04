import api from './api';

export type PipelineStatus = 'success' | 'running' | 'failed' | 'queued' | 'inactive';

export interface Pipeline {
	id: string | number;
	name: string;
	description?: string;
	status: PipelineStatus;
	source?: string;
	target?: string;
	schedule?: string;
	lastRun?: string;
	nextRun?: string;
	recordsProcessed?: number;
}

type PipelineApiItem = Record<string, unknown>;

const statusValues: PipelineStatus[] = ['success', 'running', 'failed', 'queued', 'inactive'];

const toStatus = (value: unknown): PipelineStatus => {
	const status = String(value ?? 'inactive').toLowerCase() as PipelineStatus;
	return statusValues.includes(status) ? status : 'inactive';
};

const toPipeline = (item: PipelineApiItem, index: number): Pipeline => ({
	id: (item.id ?? item.pipeline_id ?? index) as string | number,
	name: String(item.name ?? item.pipeline_name ?? `Pipeline ${index + 1}`),
	description: item.description ? String(item.description) : undefined,
	status: toStatus(item.status),
	source: item.source ? String(item.source) : undefined,
	target: item.target ? String(item.target) : undefined,
	schedule: item.schedule ? String(item.schedule) : undefined,
	lastRun: item.last_run || item.lastRun ? String(item.last_run ?? item.lastRun) : undefined,
	nextRun: item.next_run || item.nextRun ? String(item.next_run ?? item.nextRun) : undefined,
	recordsProcessed: Number(item.records_processed ?? item.recordsProcessed ?? 0),
});

const extractItems = (data: unknown): PipelineApiItem[] => {
	if (Array.isArray(data)) return data as PipelineApiItem[];
	if (data && typeof data === 'object') {
		const payload = data as Record<string, unknown>;
		const items = payload.items ?? payload.pipelines ?? payload.data;
		if (Array.isArray(items)) return items as PipelineApiItem[];
	}
	return [];
};

export const getPipelines = async (signal?: AbortSignal): Promise<Pipeline[]> => {
	const response = await api.get('/pipelines', { signal });
	return extractItems(response.data).map(toPipeline);
};

export const getPipeline = async (id: string | number): Promise<Pipeline> => {
	const response = await api.get(`/pipelines/${id}`);
	return toPipeline(response.data as PipelineApiItem, 0);
};
