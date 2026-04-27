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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-black relative">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-sm">
        <p className="font-mono text-brand-green text-xs tracking-widest mb-2">[ STAFF ACCESS ]</p>
        <h1 className="font-mono font-bold text-white text-2xl mb-1">Admin Panel</h1>
        <p className="font-mono text-brand-muted text-sm mb-8">Your Event 2026</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} Email</label>
            <input type="email" placeholder="staff@yourevent.example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-black text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
          </div>

          <div>
            <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} Password</label>
            <input type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full bg-black text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
          </div>

          {error && <p className="font-mono text-brand-red text-sm">{error}</p>}

          <button onClick={handleLogin} disabled={loading}
            className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest disabled:opacity-40 active:scale-95 transition-all border-2 mt-2"
            style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4155' }}>
            {loading ? '> A entrar...' : '> Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}