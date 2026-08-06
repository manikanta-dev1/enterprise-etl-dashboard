import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import LogsViewer from '../components/LogsViewer/LogsViewer';
import { demoLogs } from '../data/demoData';
import { getApiErrorMessage } from '../services/api';
import { getLogs, LogEntry } from '../services/logService';

const Logs = () => {
	const [logs, setLogs] = useState<LogEntry[]>();
	const [error, setError] = useState('');
	const [refreshing, setRefreshing] = useState(false);

	const loadLogs = useCallback((signal?: AbortSignal) => {
		setRefreshing(true);
		setError('');
		return getLogs(signal).then(setLogs).catch((requestError: unknown) => {
			if (!signal?.aborted) { setLogs(demoLogs); setError(`${getApiErrorMessage(requestError)} Showing sample data.`); }
		}).finally(() => { if (!signal?.aborted) setRefreshing(false); });
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		void loadLogs(controller.signal);
		return () => controller.abort();
	}, [loadLogs]);

	return (
		<Box>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}><Box><Typography variant="h4" gutterBottom>Logs</Typography><Typography color="text.secondary">Search and inspect events reported by FastAPI</Typography></Box><Button variant="outlined" startIcon={<RefreshIcon />} disabled={refreshing} onClick={() => void loadLogs()}>Refresh</Button></Stack>
			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
			{!logs && !error && <Loader />}
			{logs && <LogsViewer logs={logs} />}
		</Box>
	);
};

export default Logs;
