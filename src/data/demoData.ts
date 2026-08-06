import { Job } from '../services/jobService';
import { LogEntry } from '../services/logService';
import { Metrics } from '../services/metricsService';
import { Pipeline } from '../services/pipelineService';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const demoPipelines: Pipeline[] = [
	{ id: 'PL-001', name: 'Customer 360 Sync', description: 'Unifies customer activity across every touchpoint.', status: 'running', source: 'PostgreSQL', target: 'Snowflake', schedule: 'Every 15 minutes', lastRun: minutesAgo(7), recordsProcessed: 1_284_320 },
	{ id: 'PL-002', name: 'Revenue Warehouse', description: 'Loads billing and subscription data for reporting.', status: 'success', source: 'Stripe', target: 'BigQuery', schedule: 'Hourly at :05', lastRun: minutesAgo(44), recordsProcessed: 842_190 },
	{ id: 'PL-003', name: 'Product Analytics', description: 'Prepares behavioral events for product intelligence.', status: 'failed', source: 'Kafka', target: 'Databricks', schedule: 'Every 30 minutes', lastRun: minutesAgo(31), recordsProcessed: 429_560 },
	{ id: 'PL-004', name: 'Inventory Snapshot', description: 'Maintains a current view of inventory by location.', status: 'queued', source: 'MySQL', target: 'Snowflake', schedule: 'Daily at 02:00', lastRun: minutesAgo(670), recordsProcessed: 318_440 },
];

export const demoJobs: Job[] = [
	{ id: '8421', pipelineName: 'Customer 360 Sync', status: 'running', startedAt: minutesAgo(7), durationSeconds: 438, recordsProcessed: 284_320 },
	{ id: '8420', pipelineName: 'Revenue Warehouse', status: 'success', startedAt: minutesAgo(44), durationSeconds: 186, recordsProcessed: 842_190 },
	{ id: '8419', pipelineName: 'Product Analytics', status: 'failed', startedAt: minutesAgo(61), durationSeconds: 74, recordsProcessed: 429_560, errorMessage: 'Schema mismatch in event_properties' },
	{ id: '8418', pipelineName: 'Customer 360 Sync', status: 'success', startedAt: minutesAgo(92), durationSeconds: 231, recordsProcessed: 1_102_440 },
	{ id: '8417', pipelineName: 'Inventory Snapshot', status: 'queued', startedAt: minutesAgo(112), durationSeconds: 0, recordsProcessed: 0 },
	{ id: '8416', pipelineName: 'Revenue Warehouse', status: 'success', startedAt: minutesAgo(164), durationSeconds: 174, recordsProcessed: 798_320 },
	{ id: '8415', pipelineName: 'Customer 360 Sync', status: 'success', startedAt: minutesAgo(1510), durationSeconds: 218, recordsProcessed: 1_049_840 },
	{ id: '8414', pipelineName: 'Product Analytics', status: 'success', startedAt: minutesAgo(2920), durationSeconds: 287, recordsProcessed: 922_610 },
];

export const demoMetrics: Metrics = {
	totalPipelines: 12, activePipelines: 9, totalJobs: 8421, runningJobs: 3,
	failedJobs: 2, successRate: 98.7, recordsProcessed: 24_680_921,
	throughputPerMinute: 184_200, averageDurationSeconds: 221,
};

export const demoLogs: LogEntry[] = [
	{ id: 1, timestamp: minutesAgo(1), level: 'info', pipelineName: 'Customer 360 Sync', jobId: '8421', message: 'Loaded batch 18 of 24 · 284,320 records committed' },
	{ id: 2, timestamp: minutesAgo(3), level: 'debug', pipelineName: 'Customer 360 Sync', jobId: '8421', message: 'Checkpoint persisted at offset 983104' },
	{ id: 3, timestamp: minutesAgo(31), level: 'error', pipelineName: 'Product Analytics', jobId: '8419', message: 'Schema mismatch: event_properties.device_type expected string' },
	{ id: 4, timestamp: minutesAgo(32), level: 'warning', pipelineName: 'Product Analytics', jobId: '8419', message: 'Retry 3/3 exhausted for transformation stage' },
	{ id: 5, timestamp: minutesAgo(44), level: 'info', pipelineName: 'Revenue Warehouse', jobId: '8420', message: 'Pipeline completed successfully · 842,190 records loaded' },
	{ id: 6, timestamp: minutesAgo(47), level: 'info', pipelineName: 'Revenue Warehouse', jobId: '8420', message: 'Validated source and target row counts' },
];
