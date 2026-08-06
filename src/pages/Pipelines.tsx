import { Alert, Box, Card, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import PipelineCard from '../components/PipelineCard/PipelineCard';
import { demoPipelines } from '../data/demoData';
import { getApiErrorMessage } from '../services/api';
import { getPipelines, Pipeline } from '../services/pipelineService';

const Pipelines = () => {
	const [pipelines, setPipelines] = useState<Pipeline[]>();
	const [error, setError] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		getPipelines(controller.signal).then(setPipelines).catch((requestError: unknown) => {
			if (!controller.signal.aborted) { setPipelines(demoPipelines); setError(`${getApiErrorMessage(requestError)} Showing sample data.`); }
		});
		return () => controller.abort();
	}, []);

	return <Box><Typography variant="h4" gutterBottom>Pipelines</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Configured extraction and loading pipelines</Typography>{error && <Alert severity="error">{error}</Alert>}{!pipelines && !error && <Loader />}{pipelines && <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }, gap: 2 }}>{pipelines.map((pipeline) => <PipelineCard key={pipeline.id} pipeline={pipeline} />)}{pipelines.length === 0 && <Card variant="outlined"><CardContent><Typography color="text.secondary">No pipelines returned by the API.</Typography></CardContent></Card>}</Box>}</Box>;
};

export default Pipelines;
