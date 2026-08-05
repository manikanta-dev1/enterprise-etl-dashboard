import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Job, JobStatus } from '../../services/jobService';

interface DashboardChartsProps {
	jobs: Job[];
}

const statusColors: Record<JobStatus, string> = { success: '#2E7D32', running: '#ED6C02', failed: '#D32F2F', queued: '#64748B' };

const DashboardCharts = ({ jobs }: DashboardChartsProps) => {
	const theme = useTheme();
	const { activity, statuses } = useMemo(() => {
		const daily = new Map<string, { label: string; jobs: number; records: number }>();
		jobs.forEach((job) => {
			const date = job.startedAt ? new Date(job.startedAt) : undefined;
			const validDate = date && !Number.isNaN(date.getTime()) ? date : undefined;
			const key = validDate ? validDate.toISOString().slice(0, 10) : 'Unknown';
			const current = daily.get(key) ?? { label: validDate ? validDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Unknown', jobs: 0, records: 0 };
			current.jobs += 1;
			current.records += job.recordsProcessed ?? 0;
			daily.set(key, current);
		});
		const counts = jobs.reduce<Record<JobStatus, number>>((result, job) => ({ ...result, [job.status]: result[job.status] + 1 }), { success: 0, running: 0, failed: 0, queued: 0 });
		return {
			activity: [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-7).map(([, value]) => value),
			statuses: (Object.keys(counts) as JobStatus[]).map((status) => ({ name: status, value: counts[status] })).filter((item) => item.value > 0),
		};
	}, [jobs]);

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(280px, 1fr)' }, gap: 2 }}>
			<Card variant="outlined"><CardContent><Typography variant="h6">Job activity</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Executions over the last seven active days</Typography><Box sx={{ height: 260 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.35}/><stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.02}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider}/><XAxis dataKey="label" tickLine={false} axisLine={false}/><YAxis allowDecimals={false} tickLine={false} axisLine={false}/><Tooltip /><Area type="monotone" dataKey="jobs" stroke={theme.palette.primary.main} strokeWidth={3} fill="url(#jobsGradient)" /></AreaChart></ResponsiveContainer></Box></CardContent></Card>
			<Card variant="outlined"><CardContent><Typography variant="h6">Job status</Typography><Typography variant="body2" color="text.secondary">Current execution mix</Typography><Box sx={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statuses} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3}>{statuses.map((entry) => <Cell key={entry.name} fill={statusColors[entry.name as JobStatus]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Box><Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>{statuses.map((entry) => <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusColors[entry.name as JobStatus] }} /><Typography variant="caption" sx={{ textTransform: 'capitalize' }}>{entry.name} ({entry.value})</Typography></Box>)}</Box></CardContent></Card>
		</Box>
	);
};

export default DashboardCharts;
