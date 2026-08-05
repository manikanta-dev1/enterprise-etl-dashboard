import api from './api';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface LogEntry {
	id: string | number;
	timestamp?: string;
	level: LogLevel;
	message: string;
	pipelineName?: string;
	jobId?: string | number;
}

type LogApiItem = Record<string, unknown>;

const toLevel = (value: unknown): LogLevel => {
	const level = String(value ?? 'info').toLowerCase();
	if (level === 'warn') return 'warning';
	return ['info', 'warning', 'error', 'debug'].includes(level) ? level as LogLevel : 'info';
};

const toLogEntry = (item: LogApiItem, index: number): LogEntry => ({
	id: (item.id ?? item.log_id ?? index) as string | number,
	timestamp: item.timestamp || item.created_at ? String(item.timestamp ?? item.created_at) : undefined,
	level: toLevel(item.level ?? item.severity),
	message: String(item.message ?? item.detail ?? ''),
	pipelineName: item.pipeline_name || item.pipeline ? String(item.pipeline_name ?? item.pipeline) : undefined,
	jobId: (item.job_id ?? item.jobId) as string | number | undefined,
});

export const getLogs = async (signal?: AbortSignal): Promise<LogEntry[]> => {
	const response = await api.get('/logs', { signal });
	const payload = response.data;
	const items = Array.isArray(payload)
		? payload
		: payload && typeof payload === 'object'
			? ((payload as Record<string, unknown>).items ?? (payload as Record<string, unknown>).logs ?? (payload as Record<string, unknown>).data)
			: [];
	return Array.isArray(items) ? (items as LogApiItem[]).map(toLogEntry) : [];
};
