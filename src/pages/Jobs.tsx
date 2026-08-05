import { Alert, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import JobTable from '../components/JobTable/JobTable';
import Loader from '../components/Loader/Loader';
import { getApiErrorMessage } from '../services/api';
import { getJobs, Job } from '../services/jobService';

const Jobs = () => {
	const [jobs, setJobs] = useState<Job[]>();
	const [error, setError] = useState('');

	useEffect(() => {
		const controller = new AbortController();
		getJobs(controller.signal).then(setJobs).catch((requestError: unknown) => {
			if (!controller.signal.aborted) setError(getApiErrorMessage(requestError));
		});
		return () => controller.abort();
	}, []);

	return <Box><Typography variant="h4" gutterBottom>Jobs</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>Execution history reported by FastAPI</Typography>{error && <Alert severity="error">{error}</Alert>}{!jobs && !error && <Loader />}{jobs && <JobTable jobs={jobs} />}</Box>;
};

export default Jobs;
