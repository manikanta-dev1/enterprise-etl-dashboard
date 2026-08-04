import { Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import { getApiErrorMessage } from '../services/api';
import { getPipelines, Pipeline } from '../services/pipelineService';
import { formatDateTime, formatNumber } from '../utils/formatters';

const Pipelines = () => {
	const [pipelines, setPipelines] = useState<Pipeline[]>();
	const [error, setError] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		getPipelines(controller.signal)
			.then(setPipelines)
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) setError(getApiErrorMessage(requestError));
			});
		return () => controller.abort();
	}, []);

	return (
		<Box>
			<Typography variant="h4" gutterBottom>Pipelines</Typography>
			<Typography color="text.secondary" sx={{ mb: 3 }}>Configured extraction and loading pipelines</Typography>
			{error && <Alert severity="error">{error}</Alert>}
			{!pipelines && !error && <Loader />}
			{pipelines && (
				<TableContainer component={Paper} variant="outlined">
					<Table>
						<TableHead><TableRow><TableCell>Name</TableCell><TableCell>Source → target</TableCell><TableCell>Schedule</TableCell><TableCell>Status</TableCell><TableCell>Last run</TableCell><TableCell align="right">Records</TableCell></TableRow></TableHead>
						<TableBody>
							{pipelines.map((pipeline) => (
								<TableRow key={pipeline.id} hover><TableCell><Typography fontWeight={600}>{pipeline.name}</Typography>{pipeline.description && <Typography variant="caption" color="text.secondary">{pipeline.description}</Typography>}</TableCell><TableCell>{pipeline.source || '—'} → {pipeline.target || '—'}</TableCell><TableCell>{pipeline.schedule || '—'}</TableCell><TableCell><StatusBadge status={pipeline.status} /></TableCell><TableCell>{formatDateTime(pipeline.lastRun)}</TableCell><TableCell align="right">{formatNumber(pipeline.recordsProcessed)}</TableCell></TableRow>
							))}
							{pipelines.length === 0 && <TableRow><TableCell colSpan={6} align="center">No pipelines returned by the API.</TableCell></TableRow>}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
};

export default Pipelines;
