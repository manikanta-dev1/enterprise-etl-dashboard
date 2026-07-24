import { Chip } from '@mui/material';

type Status = 'success' | 'running' | 'failed' | 'queued';

const statusColorMap: Record<Status, 'success' | 'warning' | 'error' | 'default'> = {
  success: 'success',
  running: 'warning',
  failed: 'error',
  queued: 'default',
};

type StatusBadgeProps = {
  status: Status;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return <Chip label={status.toUpperCase()} color={statusColorMap[status]} size="small" />;
};

export default StatusBadge;