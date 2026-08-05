import { Chip } from '@mui/material';

type Status = 'success' | 'running' | 'failed' | 'queued' | 'inactive';

const statusColorMap: Record<Status, 'success' | 'warning' | 'error' | 'default'> = {
  success: 'success',
  running: 'warning',
  failed: 'error',
  queued: 'default',
  inactive: 'default',
};

type StatusBadgeProps = {
  status: Status;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const dotColors: Record<Status, string> = {
    success: '#2E7D32',
    running: '#ED6C02',
    failed: '#D32F2F',
    queued: '#64748B',
    inactive: '#94A3B8',
  };

  return (
    <Chip
      label={status.toUpperCase()}
      color={statusColorMap[status]}
      size="small"
      variant={status === 'queued' || status === 'inactive' ? 'outlined' : 'filled'}
      icon={<span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColors[status] }} />}
      sx={{ fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.04em', '& .MuiChip-icon': { ml: 1 } }}
    />
  );
};

export default StatusBadge;
