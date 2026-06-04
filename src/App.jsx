import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/AppShell.jsx';
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';
import MonitoringPage from './pages/MonitoringPage/MonitoringPage.jsx';
import PolicyPage from './pages/PolicyPage/PolicyPage.jsx';
import DomainPage from './pages/DomainPage/DomainPage.jsx';
import UserPage from './pages/UserPage/UserPage.jsx';
import SupportPage from './pages/SupportPage/SupportPage.jsx';
import DownloadPage from './pages/DownloadPage/DownloadPage.jsx';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import SettingsPage from './pages/SettingsPage/SettingsPage.jsx';
import NotificationPage from './pages/NotificationPage/NotificationPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';
import { useDownloadSettingsQuery } from './queries/companySettingsQueries.js';
import { DEFAULT_DOWNLOAD_PATH, normalizeDownloadSettings } from './utils/downloadSettings.js';

function DownloadEntryRoute({ downloadPath }) {
  if (downloadPath !== DEFAULT_DOWNLOAD_PATH) {
    return <Navigate to={downloadPath} replace />;
  }

  return <DownloadPage />;
}

export default function App() {
  const { data: downloadSettings } = useDownloadSettingsQuery();
  const { downloadPath } = normalizeDownloadSettings(downloadSettings);
  const hasCustomDownloadPath = downloadPath !== DEFAULT_DOWNLOAD_PATH;

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/radar" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path={DEFAULT_DOWNLOAD_PATH}
        element={<DownloadEntryRoute downloadPath={downloadPath} />}
      />
      {hasCustomDownloadPath ? <Route path={downloadPath} element={<DownloadPage />} /> : null}
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/policies" element={<PolicyPage />} />
        <Route path="/domains" element={<DomainPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
