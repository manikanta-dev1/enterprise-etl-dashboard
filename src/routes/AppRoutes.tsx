import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from '../components/Layout/AppLayout';
import Loader from '../components/Loader/Loader';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Jobs = lazy(() => import('../pages/Jobs'));
const Logs = lazy(() => import('../pages/Logs'));
const Metrics = lazy(() => import('../pages/Metrics'));
const Monitoring = lazy(() => import('../pages/Monitoring'));
const Pipelines = lazy(() => import('../pages/Pipelines'));
const Reports = lazy(() => import('../pages/Reports'));
const Settings = lazy(() => import('../pages/Settings'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pipelines" element={<Pipelines />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
