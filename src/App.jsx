import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from './components/AppShell.jsx';
import DashboardPage from './pages/DashboardPage/DashboardPage.jsx';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/radar" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/download" element={<Navigate to="/" replace />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
