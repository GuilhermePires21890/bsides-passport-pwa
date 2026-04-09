import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import PassportPage from './pages/PassportPage';
import ScanPage from './pages/ScanPage';
import QualifiedPage from './pages/QualifiedPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import QRCodesPage from './pages/admin/QRCodesPage';
import RecoverPage from './pages/RecoverPage';
import WelcomePage from './pages/WelcomePage';
import ResumePage from './pages/ResumePage';

function App() {
  const token = localStorage.getItem('passport_token');

  return (
    <Routes>
      {/* Attendee flow */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recover" element={<RecoverPage />} />
      <Route path="/passport" element={token ? <PassportPage /> : <Navigate to="/register" />} />
      <Route path="/scan" element={token ? <ScanPage /> : <Navigate to="/register" />} />
      <Route path="/qualified" element={token ? <QualifiedPage /> : <Navigate to="/register" />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/r/:token" element={<ResumePage />} />

      {/* Admin flow */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/qrcodes" element={<QRCodesPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
