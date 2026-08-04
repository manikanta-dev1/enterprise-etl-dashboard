import {
	Alert,
	Box,
	Card,
	CardContent,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import { getApiErrorMessage } from '../services/api';
import { getJobs, Job } from '../services/jobService';
import { getMetrics, Metrics } from '../services/metricsService';
import { getPipelines, Pipeline } from '../services/pipelineService';
import { formatDateTime, formatNumber } from '../utils/formatters';

interface DashboardData {
	metrics: Metrics;
	pipelines: Pipeline[];
	jobs: Job[];
}

const Dashboard = () => {
	const [data, setData] = useState<DashboardData>();
	const [error, setError] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		Promise.all([
			getMetrics(controller.signal),
			getPipelines(controller.signal),
			getJobs(controller.signal),
		])
			.then(([metrics, pipelines, jobs]) => setData({ metrics, pipelines, jobs }))
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) setError(getApiErrorMessage(requestError));
			});
		return () => controller.abort();
	}, []);

	if (!data && !error) return <Loader />;

	const cards = data ? [
		['Total pipelines', data.metrics.totalPipelines || data.pipelines.length],
		['Active pipelines', data.metrics.activePipelines || data.pipelines.filter((item) => item.status !== 'inactive').length],
		['Running jobs', data.metrics.runningJobs || data.jobs.filter((item) => item.status === 'running').length],
		['Success rate', `${data.metrics.successRate.toFixed(1)}%`],
	] : [];

	return (
		<Box>
			<Typography variant="h4" gutterBottom>Dashboard</Typography>
			<Typography color="text.secondary" sx={{ mb: 3 }}>Live overview from the ETL API</Typography>
			{error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
			{data && (
				<>
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
						{cards.map(([label, value]) => (
							<Card key={label} variant="outlined">
								<CardContent>
									<Typography color="text.secondary" variant="body2">{label}</Typography>
									<Typography variant="h4" sx={{ mt: 1 }}>{typeof value === 'number' ? formatNumber(value) : value}</Typography>
								</CardContent>
							</Card>
						))}
					</Box>
					<Typography variant="h6" gutterBottom>Recent jobs</Typography>
					<TableContainer component={Paper} variant="outlined">
						<Table size="small">
							<TableHead><TableRow><TableCell>Job</TableCell><TableCell>Pipeline</TableCell><TableCell>Status</TableCell><TableCell>Started</TableCell><TableCell align="right">Records</TableCell></TableRow></TableHead>
							<TableBody>
								{data.jobs.slice(0, 5).map((job) => (
									<TableRow key={job.id} hover><TableCell>{job.id}</TableCell><TableCell>{job.pipelineName}</TableCell><TableCell><StatusBadge status={job.status} /></TableCell><TableCell>{formatDateTime(job.startedAt)}</TableCell><TableCell align="right">{formatNumber(job.recordsProcessed)}</TableCell></TableRow>
								))}
								{data.jobs.length === 0 && <TableRow><TableCell colSpan={5} align="center">No jobs returned by the API.</TableCell></TableRow>}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}
		</Box>
	);
};

export default Dashboard;
