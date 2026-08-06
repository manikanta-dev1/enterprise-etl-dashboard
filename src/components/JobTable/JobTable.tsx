import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Job } from '../../services/jobService';
import { formatDateTime, formatDuration, formatNumber } from '../../utils/formatters';
import StatusBadge from '../StatusBadge/StatusBadge';

interface JobTableProps {
	jobs: Job[];
	compact?: boolean;
}

const JobTable = ({ jobs, compact = false }: JobTableProps) => (
	<TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
		<Table size={compact ? 'small' : 'medium'}>
			<TableHead>
				<TableRow>
					<TableCell>Job ID</TableCell><TableCell>Pipeline</TableCell><TableCell>Status</TableCell><TableCell>Started</TableCell><TableCell>Duration</TableCell><TableCell align="right">Records</TableCell><TableCell width={48} />
				</TableRow>
			</TableHead>
			<TableBody>
				{jobs.map((job) => (
					<TableRow key={job.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
						<TableCell><Typography variant="body2" fontFamily="monospace" color="text.secondary" fontWeight={600}>#{job.id}</Typography></TableCell>
						<TableCell><Typography variant="body2" fontWeight={700}>{job.pipelineName}</Typography></TableCell>
						<TableCell><StatusBadge status={job.status} /></TableCell>
						<TableCell>{formatDateTime(job.startedAt)}</TableCell>
						<TableCell>{formatDuration(job.durationSeconds)}</TableCell>
						<TableCell align="right">{formatNumber(job.recordsProcessed)}</TableCell>
						<TableCell><Tooltip title={job.errorMessage || 'Job details'}><IconButton size="small"><MoreHorizIcon fontSize="small" /></IconButton></Tooltip></TableCell>
					</TableRow>
				))}
				{jobs.length === 0 && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>No jobs returned by the API.</TableCell></TableRow>}
			</TableBody>
		</Table>
	</TableContainer>
);

export default JobTable;
