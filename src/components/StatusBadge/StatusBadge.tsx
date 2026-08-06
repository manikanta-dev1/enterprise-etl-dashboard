import { Box } from '@mui/material';

type Status = 'success' | 'running' | 'failed' | 'queued' | 'inactive';

const styles: Record<Status, { color: string; background: string }> = {
  success: { color: '#15803D', background: '#ECFDF3' },
  running: { color: '#4F46E5', background: '#EEF2FF' },
  failed: { color: '#DC2626', background: '#FEF2F2' },
  queued: { color: '#A16207', background: '#FFFBEB' },
  inactive: { color: '#667085', background: '#F2F4F7' },
};

type StatusBadgeProps = {
  status: Status;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: .75, px: 1, py: .45, borderRadius: 99, bgcolor: styles[status].background, color: styles[status].color, fontSize: 11, fontWeight: 750, lineHeight: 1.2, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
      <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', boxShadow: status === 'running' ? '0 0 0 3px rgba(79,70,229,.12)' : 'none' }} />
      {status}
    </Box>
  );
};

export default StatusBadge;
