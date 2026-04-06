import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await authApi.staffLogin(form.email, form.password);
      localStorage.setItem('staff_token', res.data.access_token);
      navigate('/admin/dashboard');
    } catch {
      setError('Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-dark">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-1">Staff Login</h1>
        <p className="text-white/40 text-sm mb-8">Passport BSides Porto 2025</p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
          />

          {error && <p className="text-brand-accent text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-brand-accent text-white font-semibold py-4 rounded-xl text-base disabled:opacity-50 active:scale-95 transition-transform"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
