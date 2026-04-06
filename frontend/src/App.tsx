import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import PassportPage from './pages/PassportPage';
import ScanPage from './pages/ScanPage';
import QualifiedPage from './pages/QualifiedPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function App() {
  const token = localStorage.getItem('passport_token');

  return (
    <Routes>
      {/* Attendee flow */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/passport" element={token ? <PassportPage /> : <Navigate to="/register" />} />
      <Route path="/scan" element={token ? <ScanPage /> : <Navigate to="/register" />} />
      <Route path="/qualified" element={token ? <QualifiedPage /> : <Navigate to="/register" />} />

      {/* Admin flow */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
