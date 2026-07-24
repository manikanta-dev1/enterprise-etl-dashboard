import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import Dashboard from '../pages/Dashboard';
import Jobs from '../pages/Jobs';
import Logs from '../pages/Logs';
import Metrics from '../pages/Metrics';
import Pipelines from '../pages/Pipelines';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pipelines" element={<Pipelines />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;