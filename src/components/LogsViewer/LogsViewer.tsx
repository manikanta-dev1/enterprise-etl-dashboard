import SearchIcon from '@mui/icons-material/Search';
import { Box, Chip, InputAdornment, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { LogEntry, LogLevel } from '../../services/logService';
import { formatDateTime } from '../../utils/formatters';

interface LogsViewerProps {
	logs: LogEntry[];
}

const levelColors: Record<LogLevel, string> = { info: '#38BDF8', warning: '#F59E0B', error: '#F87171', debug: '#A78BFA' };

const LogsViewer = ({ logs }: LogsViewerProps) => {
	const [level, setLevel] = useState<'all' | LogLevel>('all');
	const [query, setQuery] = useState('');
	const visibleLogs = useMemo(() => logs.filter((log) => {
		const matchesLevel = level === 'all' || log.level === level;
		const search = query.trim().toLowerCase();
		return matchesLevel && (!search || `${log.message} ${log.pipelineName ?? ''} ${log.jobId ?? ''}`.toLowerCase().includes(search));
	}), [level, logs, query]);

	return (
		<Paper variant="outlined" sx={{ overflow: 'hidden' }}>
			<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
				<TextField size="small" placeholder="Search messages, pipelines, or jobs" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} />
				<Select size="small" value={level} onChange={(event) => setLevel(event.target.value as 'all' | LogLevel)} sx={{ minWidth: 150 }}><MenuItem value="all">All levels</MenuItem><MenuItem value="info">Info</MenuItem><MenuItem value="warning">Warning</MenuItem><MenuItem value="error">Error</MenuItem><MenuItem value="debug">Debug</MenuItem></Select>
			</Stack>
			<Box sx={{ bgcolor: '#0F172A', color: '#CBD5E1', minHeight: 420, maxHeight: '65vh', overflow: 'auto', p: 2, fontFamily: 'Consolas, monospace' }}>
				{visibleLogs.map((log) => (
					<Box key={log.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '180px 82px minmax(0, 1fr)' }, gap: { xs: 0.5, md: 1.5 }, py: 1, borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
						<Typography variant="caption" component="span" sx={{ color: '#64748B', fontFamily: 'inherit' }}>{formatDateTime(log.timestamp)}</Typography>
						<Chip label={log.level.toUpperCase()} size="small" sx={{ width: 74, height: 21, color: levelColors[log.level], borderColor: levelColors[log.level], fontFamily: 'inherit', fontWeight: 700 }} variant="outlined" />
						<Typography variant="body2" component="span" sx={{ color: '#E2E8F0', fontFamily: 'inherit', overflowWrap: 'anywhere' }}>{log.pipelineName && <Box component="span" sx={{ color: '#67E8F9' }}>[{log.pipelineName}] </Box>}{log.message}{log.jobId !== undefined && <Box component="span" sx={{ color: '#64748B' }}> · job #{log.jobId}</Box>}</Typography>
					</Box>
				))}
				{visibleLogs.length === 0 && <Typography sx={{ py: 8, textAlign: 'center', color: '#64748B', fontFamily: 'inherit' }}>No log entries match the current filters.</Typography>}
			</Box>
			<Box sx={{ px: 2, py: 1, bgcolor: '#111827', color: '#64748B' }}><Typography variant="caption" fontFamily="monospace">Showing {visibleLogs.length} of {logs.length} entries</Typography></Box>
		</Paper>
	);
};

export default LogsViewer;
