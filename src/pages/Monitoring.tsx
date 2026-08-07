import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import {
	Alert, Box, Button, Card, CardContent, Chip, CircularProgress, FormControl, IconButton,
	InputAdornment, LinearProgress, MenuItem, Select, Stack, Table, TableBody, TableCell,
	TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Loader from '../components/Loader/Loader';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import { demoJobs, demoPipelines } from '../data/demoData';
import { getApiErrorMessage } from '../services/api';
import { getJobs, Job, JobStatus } from '../services/jobService';
import { getPipelines, Pipeline } from '../services/pipelineService';
import { formatDateTime, formatDuration, formatNumber } from '../utils/formatters';

type SortKey = 'recent' | 'oldest' | 'duration' | 'records';

const qualityChecks = [
	{ name: 'Completeness', detail: 'Required fields populated', score: 99.2, change: '+0.4%', color: '#12B76A' },
	{ name: 'Accuracy', detail: 'Values passing validation rules', score: 97.8, change: '+0.2%', color: '#5B5BD6' },
	{ name: 'Freshness', detail: 'Datasets within SLA window', score: 94.6, change: '-1.1%', color: '#F79009' },
	{ name: 'Uniqueness', detail: 'Records without duplicates', score: 98.4, change: '+0.1%', color: '#0BA5EC' },
];

const relativeTime = (value?: string) => {
	if (!value) return 'Not started';
	const elapsed = Date.now() - new Date(value).getTime();
	if (Number.isNaN(elapsed)) return value;
	const minutes = Math.max(1, Math.floor(elapsed / 60_000));
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
};

interface SummaryCardProps {
	label: string;
	value: string;
	detail: string;
	icon: ReactNode;
	color: string;
	progress: number;
}

const SummaryCard = ({ label, value, detail, icon, color, progress }: SummaryCardProps) => (
	<Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
		<CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
				<Box><Typography variant="body2" color="text.secondary" fontWeight={650}>{label}</Typography><Typography sx={{ fontSize: 30, fontWeight: 780, letterSpacing: '-.035em', mt: .5 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{detail}</Typography></Box>
				<Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: `${color}13`, color, display: 'grid', placeItems: 'center' }}>{icon}</Box>
			</Stack>
			<LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 4, borderRadius: 4, bgcolor: '#F0F1F5', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }} />
		</CardContent>
	</Card>
);

const Monitoring = () => {
	const [jobs, setJobs] = useState<Job[]>();
	const [pipelines, setPipelines] = useState<Pipeline[]>();
	const [error, setError] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const [query, setQuery] = useState('');
	const [status, setStatus] = useState<'all' | JobStatus>('all');
	const [sort, setSort] = useState<SortKey>('recent');

	const load = useCallback((signal?: AbortSignal) => {
		setRefreshing(true);
		setError('');
		return Promise.all([getJobs(signal), getPipelines(signal)])
			.then(([nextJobs, nextPipelines]) => { setJobs(nextJobs); setPipelines(nextPipelines); })
			.catch((requestError: unknown) => {
				if (!signal?.aborted) {
					setJobs(demoJobs);
					setPipelines(demoPipelines);
					setError(`${getApiErrorMessage(requestError)} Showing sample operations data.`);
				}
			})
			.finally(() => { if (!signal?.aborted) setRefreshing(false); });
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		void load(controller.signal);
		return () => controller.abort();
	}, [load]);

	const filteredJobs = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return [...(jobs ?? [])]
			.filter((job) => status === 'all' || job.status === status)
			.filter((job) => !normalizedQuery || job.pipelineName.toLowerCase().includes(normalizedQuery) || String(job.id).toLowerCase().includes(normalizedQuery) || job.errorMessage?.toLowerCase().includes(normalizedQuery))
			.sort((a, b) => {
				if (sort === 'duration') return (b.durationSeconds ?? 0) - (a.durationSeconds ?? 0);
				if (sort === 'records') return (b.recordsProcessed ?? 0) - (a.recordsProcessed ?? 0);
				const aTime = new Date(a.startedAt ?? 0).getTime();
				const bTime = new Date(b.startedAt ?? 0).getTime();
				return sort === 'oldest' ? aTime - bTime : bTime - aTime;
			});
	}, [jobs, query, sort, status]);

	if (!jobs || !pipelines) return <Loader />;

	const runningPipelines = pipelines.filter((pipeline) => pipeline.status === 'running');
	const failedJobs = jobs.filter((job) => job.status === 'failed');
	const completedJobs = jobs.filter((job) => job.status === 'success').length;
	const successRate = jobs.length ? (completedJobs / jobs.length) * 100 : 0;
	const qualityScore = qualityChecks.reduce((total, check) => total + check.score, 0) / qualityChecks.length;
	const statuses: Array<'all' | JobStatus> = ['all', 'running', 'failed', 'success', 'queued'];

	return (
		<Box>
			<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
				<Box><Stack direction="row" alignItems="center" spacing={1}><Typography variant="h4">Monitoring</Typography><Chip size="small" label="Live" sx={{ bgcolor: '#ECFDF3', color: '#027A48', fontWeight: 750, '&:before': { content: '""', width: 6, height: 6, borderRadius: '50%', bgcolor: '#12B76A', mr: .75 } }} /></Stack><Typography color="text.secondary" sx={{ mt: .75 }}>Track pipeline health, job execution, and data quality in real time.</Typography></Box>
				<Stack direction="row" alignItems="center" spacing={1.25}><Typography variant="caption" color="text.secondary">Updated just now</Typography><Button variant="outlined" startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshRoundedIcon />} disabled={refreshing} onClick={() => void load()}>Refresh</Button></Stack>
			</Stack>

			{error && <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2.5 }}>{error}</Alert>}

			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
				<SummaryCard label="Running pipelines" value={String(runningPipelines.length)} detail={`${pipelines.length} total pipelines`} icon={<PlayArrowRoundedIcon />} color="#5B5BD6" progress={Math.max(8, pipelines.length ? runningPipelines.length / pipelines.length * 100 : 0)} />
				<SummaryCard label="Failed jobs" value={String(failedJobs.length)} detail={failedJobs.length ? 'Requires attention' : 'No active incidents'} icon={<ErrorOutlineRoundedIcon />} color="#F04438" progress={Math.min(100, Math.max(6, failedJobs.length * 20))} />
				<SummaryCard label="Success rate" value={`${successRate.toFixed(1)}%`} detail={`${completedJobs} successful executions`} icon={<CheckCircleRoundedIcon />} color="#12B76A" progress={successRate} />
				<SummaryCard label="Data quality" value={`${qualityScore.toFixed(1)}%`} detail="Across monitored datasets" icon={<ShieldOutlinedIcon />} color="#0BA5EC" progress={qualityScore} />
			</Box>

			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.45fr) minmax(360px, .55fr)' }, gap: 2, mb: 3 }}>
				<Card variant="outlined" sx={{ borderRadius: 3 }}><CardContent sx={{ p: 2.5 }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.25 }}><Box><Typography variant="h6">Running pipelines</Typography><Typography variant="body2" color="text.secondary">Active executions and current throughput</Typography></Box><Chip size="small" label={`${runningPipelines.length} active`} sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontWeight: 700 }} /></Stack>
					<Stack spacing={1.25}>
						{runningPipelines.map((pipeline, index) => {
							const progress = 46 + index * 21;
							return <Box key={pipeline.id} sx={{ p: 1.75, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}><Box sx={{ minWidth: 0 }}><Stack direction="row" alignItems="center" spacing={1}><Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#5B5BD6', boxShadow: '0 0 0 4px #EEEEFF' }} /><Typography fontWeight={750} noWrap>{pipeline.name}</Typography></Stack><Typography variant="caption" color="text.secondary" sx={{ ml: 2.15 }}>{pipeline.source || 'Source'} → {pipeline.target || 'Destination'}</Typography></Box><Stack direction="row" spacing={2.5}><Box><Typography variant="caption" color="text.secondary">Records</Typography><Typography variant="body2" fontWeight={700}>{formatNumber(pipeline.recordsProcessed)}</Typography></Box><Box><Typography variant="caption" color="text.secondary">Started</Typography><Typography variant="body2" fontWeight={700}>{relativeTime(pipeline.lastRun)}</Typography></Box></Stack></Stack><Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1.5 }}><LinearProgress variant="determinate" value={progress} sx={{ flex: 1, height: 5, borderRadius: 4, bgcolor: '#EEEEF8', '& .MuiLinearProgress-bar': { bgcolor: '#5B5BD6', borderRadius: 4 } }} /><Typography variant="caption" fontWeight={700} color="primary.main">{progress}%</Typography></Stack></Box>;
						})}
						{runningPipelines.length === 0 && <Box sx={{ py: 4, textAlign: 'center' }}><CheckCircleRoundedIcon color="success" /><Typography color="text.secondary">No pipelines are currently running.</Typography></Box>}
					</Stack>
				</CardContent></Card>

				<Card variant="outlined" sx={{ borderRadius: 3 }}><CardContent sx={{ p: 2.5 }}>
					<Typography variant="h6">Data quality</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2.25 }}>Latest validation results</Typography>
					<Stack spacing={2.1}>{qualityChecks.map((check) => <Box key={check.name}><Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: .75 }}><Box><Typography variant="body2" fontWeight={750}>{check.name}</Typography><Typography variant="caption" color="text.secondary">{check.detail}</Typography></Box><Box sx={{ textAlign: 'right' }}><Typography variant="body2" fontWeight={800}>{check.score}%</Typography><Typography variant="caption" color={check.change.startsWith('+') ? 'success.main' : 'error.main'}>{check.change}</Typography></Box></Stack><LinearProgress variant="determinate" value={check.score} sx={{ height: 5, borderRadius: 4, bgcolor: '#F0F1F5', '& .MuiLinearProgress-bar': { bgcolor: check.color, borderRadius: 4 } }} /></Box>)}</Stack>
					<Button fullWidth sx={{ mt: 2.5 }}>View quality report</Button>
				</CardContent></Card>
			</Box>

			<Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
				<Box sx={{ p: 2.5, pb: 2 }}><Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" spacing={2}><Box><Typography variant="h6">Execution status</Typography><Typography variant="body2" color="text.secondary">All recent pipeline job activity</Typography></Box><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}><TextField size="small" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pipeline or job..." inputProps={{ 'aria-label': 'Search executions' }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }} sx={{ width: { sm: 250 } }} /><FormControl size="small" sx={{ minWidth: 145 }}><Select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} IconComponent={KeyboardArrowDownRoundedIcon} inputProps={{ 'aria-label': 'Sort executions' }}><MenuItem value="recent">Newest first</MenuItem><MenuItem value="oldest">Oldest first</MenuItem><MenuItem value="duration">Longest duration</MenuItem><MenuItem value="records">Most records</MenuItem></Select></FormControl></Stack></Stack>
					<Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: .25 }}>{statuses.map((item) => <Chip key={item} clickable onClick={() => setStatus(item)} icon={item === 'all' ? <FilterListRoundedIcon /> : undefined} label={item === 'all' ? `All (${jobs.length})` : `${item[0].toUpperCase()}${item.slice(1)} (${jobs.filter((job) => job.status === item).length})`} variant={status === item ? 'filled' : 'outlined'} sx={status === item ? { bgcolor: '#1B1D29', color: '#fff', '& .MuiChip-icon': { color: '#fff' } } : { bgcolor: '#fff' }} />)}</Stack>
				</Box>
				<TableContainer><Table><TableHead><TableRow><TableCell>Job</TableCell><TableCell>Pipeline</TableCell><TableCell>Status</TableCell><TableCell>Started</TableCell><TableCell>Duration</TableCell><TableCell align="right">Records</TableCell><TableCell width={52} /></TableRow></TableHead><TableBody>
					{filteredJobs.map((job) => <TableRow key={job.id} hover><TableCell><Typography variant="body2" fontFamily="monospace" color="text.secondary" fontWeight={650}>#{job.id}</Typography></TableCell><TableCell><Typography variant="body2" fontWeight={750}>{job.pipelineName}</Typography>{job.errorMessage && <Typography variant="caption" color="error.main" noWrap sx={{ display: 'block', maxWidth: 280 }}>{job.errorMessage}</Typography>}</TableCell><TableCell><StatusBadge status={job.status} /></TableCell><TableCell><Stack direction="row" spacing={.75} alignItems="center"><AccessTimeRoundedIcon sx={{ fontSize: 15, color: 'text.disabled' }} /><Typography variant="body2">{formatDateTime(job.startedAt)}</Typography></Stack></TableCell><TableCell>{formatDuration(job.durationSeconds)}</TableCell><TableCell align="right">{formatNumber(job.recordsProcessed)}</TableCell><TableCell><Tooltip title="View job details"><IconButton size="small"><MoreHorizRoundedIcon fontSize="small" /></IconButton></Tooltip></TableCell></TableRow>)}
					{filteredJobs.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><SearchRoundedIcon sx={{ color: 'text.disabled', mb: .5 }} /><Typography color="text.secondary">No executions match your filters.</Typography><Button size="small" onClick={() => { setQuery(''); setStatus('all'); }}>Clear filters</Button></TableCell></TableRow>}
				</TableBody></Table></TableContainer>
				<Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}><Typography variant="caption" color="text.secondary">Showing {filteredJobs.length} of {jobs.length} executions</Typography></Box>
			</Card>
		</Box>
	);
};

export default Monitoring;
