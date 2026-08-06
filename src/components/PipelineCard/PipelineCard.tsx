import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { Pipeline } from '../../services/pipelineService';
import { formatDateTime, formatNumber } from '../../utils/formatters';
import StatusBadge from '../StatusBadge/StatusBadge';

interface PipelineCardProps {
	pipeline: Pipeline;
}

const PipelineCard = ({ pipeline }: PipelineCardProps) => (
	<Card variant="outlined" sx={{ height: '100%', transition: 'transform 160ms ease, box-shadow 160ms ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 28px rgba(30,35,55,.08)' } }}>
		<CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="subtitle1" fontWeight={750} noWrap>{pipeline.name}</Typography>
					<Typography variant="body2" color="text.secondary" noWrap sx={{ mt: .25 }}>{pipeline.description || 'ETL data pipeline'}</Typography>
				</Box>
				<StatusBadge status={pipeline.status} />
			</Stack>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ my: 2.25, color: 'text.secondary', bgcolor: '#F8F9FC', borderRadius: 2, p: 1.25 }}>
				<StorageOutlinedIcon sx={{ fontSize: 18, color: 'primary.main' }} />
				<Typography variant="body2" noWrap>{pipeline.source || 'Source'}</Typography>
				<ArrowForwardIcon sx={{ fontSize: 16 }} />
				<DnsOutlinedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
				<Typography variant="body2" noWrap>{pipeline.target || 'Target'}</Typography>
			</Stack>
			<LinearProgress variant="determinate" value={pipeline.status === 'failed' ? 68 : pipeline.status === 'running' ? 76 : pipeline.status === 'queued' ? 8 : 100} color={pipeline.status === 'failed' ? 'error' : pipeline.status === 'queued' ? 'warning' : 'primary'} sx={{ height: 4, borderRadius: 4, bgcolor: '#F0F1F5' }} />
			<Stack direction="row" justifyContent="space-between" sx={{ mt: 1.75 }}>
				<Box>
					<Typography variant="caption" color="text.secondary">Last run</Typography>
					<Typography variant="body2" fontWeight={600}>{formatDateTime(pipeline.lastRun)}</Typography>
				</Box>
				<Box sx={{ textAlign: 'right' }}>
					<Typography variant="caption" color="text.secondary">Records</Typography>
					<Typography variant="body2" fontWeight={700}>{formatNumber(pipeline.recordsProcessed)}</Typography>
				</Box>
			</Stack>
			{pipeline.schedule && <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.5, color: 'text.secondary' }}><ScheduleIcon sx={{ fontSize: 16 }} /><Typography variant="caption">{pipeline.schedule}</Typography></Stack>}
		</CardContent>
	</Card>
);

export default PipelineCard;
