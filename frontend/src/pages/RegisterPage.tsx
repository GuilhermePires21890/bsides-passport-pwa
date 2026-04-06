import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi, eventsApi } from '../services/api';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', company: '',
    rgpdConsent: false, rgpdShare: false,
  });
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
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        rgpdConsent: form.rgpdConsent,
        eventId,
      });
      localStorage.setItem('passport_token', res.data.token);
      navigate('/passport');
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-brand-dark">

      {/* Header */}
      <button onClick={() => navigate('/')} className="text-white/50 text-sm mb-8 text-left">
        ← {t('common.back')}
      </button>

      <h1 className="text-2xl font-bold text-white mb-1">{t('register.title')}</h1>
      <p className="text-white/50 text-sm mb-8">BSides Porto 2025</p>

      {/* Form */}
      <div className="flex flex-col gap-4 max-w-md w-full">

        <div>
          <label className="text-white/70 text-sm mb-1 block">{t('register.name')} *</label>
          <input
            type="text"
            placeholder={t('register.name_placeholder')}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="text-white/70 text-sm mb-1 block">{t('register.email')} *</label>
          <input
            type="email"
            placeholder={t('register.email_placeholder')}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        <div>
          <label className="text-white/70 text-sm mb-1 block">{t('register.company')}</label>
          <input
            type="text"
            placeholder={t('register.company_placeholder')}
            value={form.company}
            onChange={e => setForm({ ...form, company: e.target.value })}
            className="w-full bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>

        {/* RGPD */}
        <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-3 mt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.rgpdConsent}
              onChange={e => setForm({ ...form, rgpdConsent: e.target.checked })}
              className="mt-1 accent-brand-accent"
            />
            <span className="text-white/70 text-xs leading-relaxed">{t('register.rgpd')}</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.rgpdShare}
              onChange={e => setForm({ ...form, rgpdShare: e.target.checked })}
              className="mt-1 accent-brand-accent"
            />
            <span className="text-white/70 text-xs leading-relaxed">{t('register.rgpd_share')}</span>
          </label>
        </div>

        {error && <p className="text-brand-accent text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !eventId}
          className="w-full bg-brand-accent text-white font-semibold py-4 rounded-xl text-base mt-2 disabled:opacity-50 active:scale-95 transition-transform"
        >
          {loading ? t('common.loading') : t('register.submit')}
        </button>

        <button
          onClick={() => navigate('/')}
          className="text-white/40 text-xs text-center mt-1"
        >
          {t('register.already_registered')}
        </button>
      </div>
    </div>
  );
}
