import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi, eventsApi } from '../services/api';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', company: '', rgpdConsent: false, rgpdShare: false });
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    eventsApi.getActive()
      .then(res => setEventId(res.data.id))
      .catch(() => setError('Nenhum evento activo encontrado.'));
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.rgpdConsent) {
      setError('Preenche o nome, email e aceita os termos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register({
        name: form.name, email: form.email,
        company: form.company || undefined,
        rgpdConsent: form.rgpdConsent, eventId,
      });
      localStorage.setItem('passport_token', res.data.token);
      window.location.href = '/passport';
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-brand-black relative">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-md">
        <button onClick={() => navigate('/')} className="font-mono text-brand-green text-sm mb-8 block hover:text-white transition-colors">
          ← {t('common.back')}
        </button>

        <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ REGISTO ]</p>
        <h1 className="font-mono font-bold text-white text-2xl mb-1">{t('register.title')}</h1>
        <p className="font-mono text-brand-muted text-sm mb-8">BSides Porto 2026</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} {t('register.name')} *</label>
            <input type="text" placeholder={t('register.name_placeholder')} value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-brand-gray text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
          </div>

          <div>
            <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} {t('register.email')} *</label>
            <input type="email" placeholder={t('register.email_placeholder')} value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-brand-gray text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
          </div>

          <div>
            <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} {t('register.company')}</label>
            <input type="text" placeholder={t('register.company_placeholder')} value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              className="w-full bg-brand-gray text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
          </div>

          {/* RGPD */}
          <div className="border border-brand-gray2 rounded p-4 flex flex-col gap-3 mt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.rgpdConsent}
                onChange={e => setForm({ ...form, rgpdConsent: e.target.checked })}
                className="mt-1 accent-brand-green" />
              <span className="font-mono text-brand-muted text-xs leading-relaxed">{t('register.rgpd')}</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.rgpdShare}
                onChange={e => setForm({ ...form, rgpdShare: e.target.checked })}
                className="mt-1 accent-brand-green" />
              <span className="font-mono text-brand-muted text-xs leading-relaxed">{t('register.rgpd_share')}</span>
            </label>
          </div>

          {error && <p className="font-mono text-brand-red text-sm">{error}</p>}

          <button onClick={handleSubmit} disabled={loading || !eventId}
            className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest mt-2 disabled:opacity-40 active:scale-95 transition-all border-2"
            style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4155' }}>
            {loading ? '> A processar...' : `> ${t('register.submit')}`}
          </button>

          <button onClick={() => navigate('/')} className="font-mono text-brand-muted text-xs text-center mt-1 hover:text-brand-green transition-colors">
            {t('register.already_registered')}
          </button>
        </div>
      </div>
    </div>
  );
}