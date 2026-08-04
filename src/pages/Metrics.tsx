import { Alert, Box, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import { getApiErrorMessage } from '../services/api';
import { getMetrics, Metrics as MetricsData } from '../services/metricsService';
import { formatDuration, formatNumber } from '../utils/formatters';

const Metrics = () => {
	const [metrics, setMetrics] = useState<MetricsData>();
	const [error, setError] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		getMetrics(controller.signal)
			.then(setMetrics)
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) setError(getApiErrorMessage(requestError));
			});
		return () => controller.abort();
	}, []);

	const cards = metrics ? [
		['Records processed', formatNumber(metrics.recordsProcessed)],
		['Throughput / minute', formatNumber(metrics.throughputPerMinute)],
		['Average duration', formatDuration(metrics.averageDurationSeconds)],
		['Failed jobs', formatNumber(metrics.failedJobs)],
		['Total jobs', formatNumber(metrics.totalJobs)],
		['Active pipelines', formatNumber(metrics.activePipelines)],
	] : [];

	return (
		<Box>
			<Typography variant="h4" gutterBottom>Metrics</Typography>
			<Typography color="text.secondary" sx={{ mb: 3 }}>Current ETL performance and reliability</Typography>
			{error && <Alert severity="error">{error}</Alert>}
			{!metrics && !error && <Loader />}
			{metrics && (
				<>
					<Card variant="outlined" sx={{ mb: 3 }}>
						<CardContent>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography fontWeight={600}>Job success rate</Typography><Typography fontWeight={700}>{metrics.successRate.toFixed(1)}%</Typography></Box>
							<LinearProgress variant="determinate" value={Math.min(100, Math.max(0, metrics.successRate))} color={metrics.successRate >= 90 ? 'success' : 'warning'} sx={{ height: 10, borderRadius: 5 }} />
						</CardContent>
					</Card>
					<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
						{cards.map(([label, value]) => <Card key={label} variant="outlined"><CardContent><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography></CardContent></Card>)}
					</Box>
				</>
			)}
		</Box>
	);
};

export default Metrics;
