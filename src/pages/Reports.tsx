import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	InputAdornment,
	LinearProgress,
	Snackbar,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { ReactElement, useMemo, useState } from 'react';
import { demoJobs, demoMetrics, demoPipelines } from '../data/demoData';

type ReportCategory = 'All reports' | 'Operations' | 'Performance' | 'Reliability';

type Report = {
	id: string;
	title: string;
	description: string;
	category: Exclude<ReportCategory, 'All reports'>;
	updated: string;
	period: string;
	rows: number;
	icon: ReactElement;
	columns: string[];
	data: Array<Array<string | number>>;
};

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const downloadCsv = (filename: string, columns: string[], rows: Array<Array<string | number>>) => {
	const csv = [columns, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
	const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	URL.revokeObjectURL(url);
};

const reports: Report[] = [
	{
		id: 'operations-summary',
		title: 'Daily operations summary',
		description: 'A concise view of pipeline activity, job volume, throughput, and overall health.',
		category: 'Operations',
		updated: 'Today, 08:30 AM',
		period: 'Last 24 hours',
		rows: 8,
		icon: <AssessmentOutlinedIcon />,
		columns: ['Metric', 'Value'],
		data: [
			['Total pipelines', demoMetrics.totalPipelines],
			['Active pipelines', demoMetrics.activePipelines],
			['Total jobs', demoMetrics.totalJobs],
			['Running jobs', demoMetrics.runningJobs],
			['Failed jobs', demoMetrics.failedJobs],
			['Success rate', `${demoMetrics.successRate}%`],
			['Records processed', demoMetrics.recordsProcessed],
			['Throughput per minute', demoMetrics.throughputPerMinute],
		],
	},
	{
		id: 'pipeline-performance',
		title: 'Pipeline performance',
		description: 'Pipeline-level processing volume, current status, schedules, and recent run activity.',
		category: 'Performance',
		updated: 'Today, 08:15 AM',
		period: 'Last 7 days',
		rows: demoPipelines.length,
		icon: <StorageRoundedIcon />,
		columns: ['Pipeline ID', 'Pipeline', 'Status', 'Source', 'Target', 'Schedule', 'Records processed', 'Last run'],
		data: demoPipelines.map((pipeline) => [
			pipeline.id,
			pipeline.name,
			pipeline.status,
			pipeline.source ?? '',
			pipeline.target ?? '',
			pipeline.schedule ?? '',
			pipeline.recordsProcessed ?? 0,
			pipeline.lastRun ?? '',
		]),
	},
	{
		id: 'job-history',
		title: 'Job execution history',
		description: 'Detailed execution records with duration, processed volume, and outcome for every job.',
		category: 'Operations',
		updated: 'Today, 08:15 AM',
		period: 'Last 30 days',
		rows: demoJobs.length,
		icon: <HistoryRoundedIcon />,
		columns: ['Job ID', 'Pipeline', 'Status', 'Started at', 'Duration (seconds)', 'Records processed', 'Error'],
		data: demoJobs.map((job) => [
			job.id,
			job.pipelineName,
			job.status,
			job.startedAt ?? '',
			job.durationSeconds ?? 0,
			job.recordsProcessed ?? 0,
			job.errorMessage ?? '',
		]),
	},
	{
		id: 'failure-analysis',
		title: 'Failure analysis',
		description: 'Failed executions and their error details, ready for triage and incident review.',
		category: 'Reliability',
		updated: 'Yesterday, 06:00 PM',
		period: 'Last 30 days',
		rows: demoJobs.filter((job) => job.status === 'failed').length,
		icon: <ErrorOutlineRoundedIcon />,
		columns: ['Job ID', 'Pipeline', 'Started at', 'Duration (seconds)', 'Records processed', 'Error'],
		data: demoJobs
			.filter((job) => job.status === 'failed')
			.map((job) => [job.id, job.pipelineName, job.startedAt ?? '', job.durationSeconds ?? 0, job.recordsProcessed ?? 0, job.errorMessage ?? 'Unknown error']),
	},
];

const categories: ReportCategory[] = ['All reports', 'Operations', 'Performance', 'Reliability'];

const Reports = () => {
	const [category, setCategory] = useState<ReportCategory>('All reports');
	const [query, setQuery] = useState('');
	const [downloadedReport, setDownloadedReport] = useState('');

	const filteredReports = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		return reports.filter((report) => {
			const matchesCategory = category === 'All reports' || report.category === category;
			const matchesQuery = !normalizedQuery || `${report.title} ${report.description} ${report.category}`.toLowerCase().includes(normalizedQuery);
			return matchesCategory && matchesQuery;
		});
	}, [category, query]);

	const handleDownload = (report: Report) => {
		downloadCsv(`${report.id}.csv`, report.columns, report.data);
		setDownloadedReport(report.title);
	};

	const handleDownloadAll = () => {
		const columns = ['Report', 'Category', 'Field 1', 'Field 2', 'Field 3', 'Field 4', 'Field 5', 'Field 6', 'Field 7', 'Field 8'];
		const rows = reports.flatMap((report) => report.data.map((row) => [report.title, report.category, ...row]));
		downloadCsv('flowcast-report-pack.csv', columns, rows);
		setDownloadedReport('Full report pack');
	};

	return (
		<Box>
			<Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-start' }} spacing={2} sx={{ mb: 3 }}>
				<Box>
					<Typography variant="h4" gutterBottom>Reports</Typography>
					<Typography color="text.secondary">Export ready-to-share insights across your ETL operations.</Typography>
				</Box>
				<Button variant="contained" startIcon={<DownloadRoundedIcon />} onClick={handleDownloadAll} sx={{ alignSelf: { sm: 'center' }, px: 2.25 }}>
					Download report pack
				</Button>
			</Stack>

			<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
				<Card variant="outlined"><CardContent><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="body2" color="text.secondary">Available reports</Typography><Typography variant="h4" sx={{ mt: .75 }}>{reports.length}</Typography></Box><Box sx={{ width: 40, height: 40, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: '#EEEEFF', color: 'primary.main' }}><DescriptionOutlinedIcon /></Box></Stack></CardContent></Card>
				<Card variant="outlined"><CardContent><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="body2" color="text.secondary">Success rate</Typography><Typography variant="h4" sx={{ mt: .75 }}>{demoMetrics.successRate}%</Typography></Box><Box sx={{ width: 40, height: 40, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: '#EAFBF4', color: '#059669' }}><CheckCircleOutlineIcon /></Box></Stack><LinearProgress variant="determinate" value={demoMetrics.successRate} sx={{ mt: 2, height: 5, borderRadius: 5, bgcolor: '#EAFBF4', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }} /></CardContent></Card>
				<Card variant="outlined"><CardContent><Stack direction="row" justifyContent="space-between" alignItems="flex-start"><Box><Typography variant="body2" color="text.secondary">Records processed</Typography><Typography variant="h4" sx={{ mt: .75 }}>24.7M</Typography></Box><Box sx={{ width: 40, height: 40, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: '#FFF5E8', color: '#D97706' }}><StorageRoundedIcon /></Box></Stack></CardContent></Card>
			</Box>

			<Card variant="outlined">
				<Box sx={{ p: { xs: 2, md: 2.5 }, borderBottom: 1, borderColor: 'divider' }}>
					<Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ md: 'center' }}>
						<Box><Typography variant="h6">Report library</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .4 }}>Choose a report to download as a CSV file.</Typography></Box>
						<TextField
							size="small"
							placeholder="Search reports"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							inputProps={{ 'aria-label': 'Search reports' }}
							InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }}
							sx={{ width: { xs: '100%', md: 270 }, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
						/>
					</Stack>
					<Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: .25 }}>
						{categories.map((item) => <Chip key={item} label={item} clickable onClick={() => setCategory(item)} color={category === item ? 'primary' : 'default'} variant={category === item ? 'filled' : 'outlined'} sx={{ flexShrink: 0, fontWeight: 650 }} />)}
					</Stack>
				</Box>

				<Box sx={{ p: { xs: 2, md: 2.5 } }}>
					{filteredReports.length > 0 ? (
						<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2 }}>
							{filteredReports.map((report) => (
								<Card key={report.id} variant="outlined" sx={{ height: '100%', transition: 'border-color .2s, box-shadow .2s', '&:hover': { borderColor: '#CFCFF5', boxShadow: '0 8px 24px rgba(42, 44, 90, .07)' } }}>
									<CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2.5, '&:last-child': { pb: 2.5 } }}>
										<Stack direction="row" spacing={1.5} alignItems="flex-start">
											<Box sx={{ width: 42, height: 42, flexShrink: 0, borderRadius: 2.5, display: 'grid', placeItems: 'center', bgcolor: '#F0F0FF', color: 'primary.main' }}>{report.icon}</Box>
											<Box sx={{ minWidth: 0, flex: 1 }}><Stack direction="row" justifyContent="space-between" spacing={1}><Typography variant="h6" sx={{ fontSize: 17 }}>{report.title}</Typography><Chip label={report.category} size="small" variant="outlined" sx={{ display: { xs: 'none', sm: 'flex' }, height: 24, fontSize: 11 }} /></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: .75, lineHeight: 1.55 }}>{report.description}</Typography></Box>
										</Stack>
										<Stack direction="row" spacing={2.5} sx={{ mt: 2.5, mb: 2.25 }}><Box><Typography variant="caption" color="text.secondary">REPORTING PERIOD</Typography><Typography variant="body2" fontWeight={650} sx={{ mt: .25 }}>{report.period}</Typography></Box><Box><Typography variant="caption" color="text.secondary">ROWS</Typography><Typography variant="body2" fontWeight={650} sx={{ mt: .25 }}>{report.rows.toLocaleString()}</Typography></Box></Stack>
										<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto', pt: 1.75, borderTop: 1, borderColor: 'divider' }}><Typography variant="caption" color="text.secondary">Updated {report.updated}</Typography><Button size="small" startIcon={<DownloadRoundedIcon />} onClick={() => handleDownload(report)} aria-label={`Download ${report.title} as CSV`}>Download CSV</Button></Stack>
									</CardContent>
								</Card>
							))}
						</Box>
					) : (
						<Box sx={{ py: 7, textAlign: 'center' }}><SearchRoundedIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} /><Typography fontWeight={700}>No reports found</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Try another search term or report category.</Typography></Box>
					)}
				</Box>
			</Card>

			<Snackbar open={Boolean(downloadedReport)} autoHideDuration={3000} onClose={() => setDownloadedReport('')} message={`${downloadedReport} downloaded as CSV`} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
		</Box>
	);
};

export default Reports;
