import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { Pipeline } from '../../services/pipelineService';
import { formatDateTime, formatNumber } from '../../utils/formatters';
import StatusBadge from '../StatusBadge/StatusBadge';

interface PipelineCardProps {
	pipeline: Pipeline;
}

const PipelineCard = ({ pipeline }: PipelineCardProps) => (
	<Card variant="outlined" sx={{ height: '100%', transition: 'transform 160ms ease, box-shadow 160ms ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}>
		<CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
			<Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
				<Box sx={{ minWidth: 0 }}>
					<Typography variant="h6" noWrap>{pipeline.name}</Typography>
					<Typography variant="body2" color="text.secondary" noWrap>{pipeline.description || 'ETL data pipeline'}</Typography>
				</Box>
				<StatusBadge status={pipeline.status} />
			</Stack>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ my: 2.25, color: 'text.secondary' }}>
				<StorageOutlinedIcon fontSize="small" />
				<Typography variant="body2" noWrap>{pipeline.source || 'Source'}</Typography>
				<ArrowForwardIcon sx={{ fontSize: 16 }} />
				<DnsOutlinedIcon fontSize="small" />
				<Typography variant="body2" noWrap>{pipeline.target || 'Target'}</Typography>
			</Stack>
			<Divider />
			<Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
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
