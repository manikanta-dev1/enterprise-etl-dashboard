import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import DashboardCharts from '../components/DashboardCharts/DashboardCharts';
import JobTable from '../components/JobTable/JobTable';
import Loader from '../components/Loader/Loader';
import PipelineCard from '../components/PipelineCard/PipelineCard';
import { getApiErrorMessage } from '../services/api';
import { getJobs, Job } from '../services/jobService';
import { getMetrics, Metrics } from '../services/metricsService';
import { getPipelines, Pipeline } from '../services/pipelineService';
import { formatNumber } from '../utils/formatters';

interface DashboardData { metrics: Metrics; pipelines: Pipeline[]; jobs: Job[]; }
interface MetricCardProps { label: string; value: string; detail: string; icon: ReactNode; color: string; }

const MetricCard = ({ label, value, detail, icon, color }: MetricCardProps) => (
	<Card variant="outlined" sx={{ height: '100%' }}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="body2" color="text.secondary">{label}</Typography><Typography variant="h4" sx={{ mt: 0.75, mb: 0.5 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{detail}</Typography></Box><Box sx={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: 2, bgcolor: `${color}18`, color }}>{icon}</Box></Stack></CardContent></Card>
);

const Dashboard = () => {
	const [data, setData] = useState<DashboardData>();
	const [error, setError] = useState('');
	const [refreshing, setRefreshing] = useState(false);

	const loadDashboard = useCallback((signal?: AbortSignal) => {
		setRefreshing(true);
		setError('');
		return Promise.all([getMetrics(signal), getPipelines(signal), getJobs(signal)])
			.then(([metrics, pipelines, jobs]) => setData({ metrics, pipelines, jobs }))
			.catch((requestError: unknown) => { if (!signal?.aborted) setError(getApiErrorMessage(requestError)); })
			.finally(() => { if (!signal?.aborted) setRefreshing(false); });
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		void loadDashboard(controller.signal);
		return () => controller.abort();
	}, [loadDashboard]);

	if (!data && !error) return <Loader />;

	const activePipelines = data ? data.metrics.activePipelines || data.pipelines.filter((pipeline) => pipeline.status !== 'inactive').length : 0;
	const runningJobs = data ? data.metrics.runningJobs || data.jobs.filter((job) => job.status === 'running').length : 0;
	const successRate = data?.metrics.successRate ?? 0;
	const cards: MetricCardProps[] = data ? [
		{ label: 'Total pipelines', value: formatNumber(data.metrics.totalPipelines || data.pipelines.length), detail: `${activePipelines} currently active`, icon: <DnsOutlinedIcon />, color: '#0A6E7A' },
		{ label: 'Running jobs', value: formatNumber(runningJobs), detail: `${data.jobs.filter((job) => job.status === 'queued').length} waiting in queue`, icon: <PlayCircleOutlineIcon />, color: '#E67E22' },
		{ label: 'Records processed', value: formatNumber(data.metrics.recordsProcessed), detail: `${formatNumber(data.metrics.throughputPerMinute)} per minute`, icon: <StorageOutlinedIcon />, color: '#2563EB' },
		{ label: 'Success rate', value: `${successRate.toFixed(1)}%`, detail: `${data.metrics.failedJobs || data.jobs.filter((job) => job.status === 'failed').length} failed jobs`, icon: <CheckCircleOutlineIcon />, color: '#2E7D32' },
	] : [];

	return (
		<Box>
			<Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}><Box><Typography variant="h4" gutterBottom>Operations dashboard</Typography><Typography color="text.secondary">Live health and performance across your ETL platform</Typography></Box><Button variant="outlined" startIcon={<RefreshIcon />} disabled={refreshing} onClick={() => void loadDashboard()}>{refreshing ? 'Refreshing' : 'Refresh data'}</Button></Stack>
			{error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
			{data && <Stack spacing={3}>
				<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2 }}>{cards.map((card) => <MetricCard key={card.label} {...card} />)}</Box>
				<DashboardCharts jobs={data.jobs} />
				<Box><Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}><Box><Typography variant="h6">Pipeline health</Typography><Typography variant="body2" color="text.secondary">Most recently active pipelines</Typography></Box><Typography variant="body2" color="text.secondary">{activePipelines} active</Typography></Stack><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 2 }}>{data.pipelines.slice(0, 3).map((pipeline) => <PipelineCard key={pipeline.id} pipeline={pipeline} />)}{data.pipelines.length === 0 && <Card variant="outlined"><CardContent><Typography color="text.secondary">No pipelines returned by the API.</Typography></CardContent></Card>}</Box></Box>
				<Box><Typography variant="h6">Recent jobs</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Latest executions and their current state</Typography><JobTable jobs={data.jobs.slice(0, 6)} compact /></Box>
			</Stack>}
		</Box>
	);
};

export default Dashboard;
