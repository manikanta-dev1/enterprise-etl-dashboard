import { Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import { getApiErrorMessage } from '../services/api';
import { getJobs, Job } from '../services/jobService';
import { formatDateTime, formatDuration, formatNumber } from '../utils/formatters';

const Jobs = () => {
	const [jobs, setJobs] = useState<Job[]>();
	const [error, setError] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		getJobs(controller.signal)
			.then(setJobs)
			.catch((requestError: unknown) => {
				if (!controller.signal.aborted) setError(getApiErrorMessage(requestError));
			});
		return () => controller.abort();
	}, []);

	return (
		<Box>
			<Typography variant="h4" gutterBottom>Jobs</Typography>
			<Typography color="text.secondary" sx={{ mb: 3 }}>Execution history reported by FastAPI</Typography>
			{error && <Alert severity="error">{error}</Alert>}
			{!jobs && !error && <Loader />}
			{jobs && (
				<TableContainer component={Paper} variant="outlined">
					<Table>
						<TableHead><TableRow><TableCell>Job ID</TableCell><TableCell>Pipeline</TableCell><TableCell>Status</TableCell><TableCell>Started</TableCell><TableCell>Duration</TableCell><TableCell align="right">Records</TableCell></TableRow></TableHead>
						<TableBody>
							{jobs.map((job) => (
								<Tooltip key={job.id} title={job.errorMessage || ''} placement="top" arrow>
									<TableRow hover><TableCell>{job.id}</TableCell><TableCell>{job.pipelineName}</TableCell><TableCell><StatusBadge status={job.status} /></TableCell><TableCell>{formatDateTime(job.startedAt)}</TableCell><TableCell>{formatDuration(job.durationSeconds)}</TableCell><TableCell align="right">{formatNumber(job.recordsProcessed)}</TableCell></TableRow>
								</Tooltip>
							))}
							{jobs.length === 0 && <TableRow><TableCell colSpan={6} align="center">No jobs returned by the API.</TableCell></TableRow>}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
};

export default Jobs;
