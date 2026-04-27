import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authApi, eventsApi } from '../services/api';

// Common email domains for typo detection
const COMMON_DOMAINS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com',
  'sapo.pt', 'hotmail.pt', 'live.com', 'icloud.com',
  'me.com', 'protonmail.com', 'msn.com',
];

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function detectEmailTypo(email: string): string | null {
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const domain = parts[1].toLowerCase();
  if (COMMON_DOMAINS.includes(domain)) return null; // already correct

  let closest: string | null = null;
  let minDist = Infinity;
  for (const d of COMMON_DOMAINS) {
    const dist = levenshtein(domain, d);
    if (dist < minDist && dist <= 2) { // max 2 char difference
      minDist = dist;
      closest = d;
    }
  }
  return closest ? `${parts[0]}@${closest}` : null;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', company: '', rgpdConsent: false, rgpdShare: false });
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);

  useEffect(() => {
    eventsApi.getActive()
      .then(res => setEventId(res.data.id))
      .catch(() => setError('Nenhum evento activo encontrado.'));
  }, []);

  const handleEmailChange = (value: string) => {
    setForm({ ...form, email: value });
    // Only check when email looks complete (has @ and domain with .)
    if (value.includes('@') && value.split('@')[1]?.includes('.')) {
      setEmailSuggestion(detectEmailTypo(value));
    } else {
      setEmailSuggestion(null);
    }
  };

  const applyEmailSuggestion = () => {
    if (!emailSuggestion) return;
    setForm({ ...form, email: emailSuggestion });
    setEmailSuggestion(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.rgpdConsent) {
      setError('Preenche o nome, email e aceita os termos.');
      return;
    }
    // Block submit if there's a suggestion pending — force user to decide
    if (emailSuggestion) {
      setError('Confirma o teu email antes de continuar.');
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
      localStorage.setItem('passport_name', form.name);
      window.location.href = '/welcome';
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
        <p className="font-mono text-brand-muted text-sm mb-8">Your Event 2026</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} {t('register.name')} *</label>
            <input type="text" placeholder={t('register.name_placeholder')} value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-brand-gray text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors" />
          </div>

          <div>
            <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} {t('register.email')} *</label>
            <input
              type="email"
              placeholder={t('register.email_placeholder')}
              value={form.email}
              onChange={e => handleEmailChange(e.target.value)}
              className={`w-full bg-brand-gray text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border transition-colors
                ${emailSuggestion ? 'border-brand-yellow' : 'border-brand-gray2 focus:border-brand-green'}`}
            />
            {/* Typo suggestion */}
            {emailSuggestion && (
              <div className="mt-2 border border-brand-yellow rounded px-3 py-2 flex items-center justify-between gap-2"
                style={{ boxShadow: '0 0 8px #FFD70022' }}>
                <p className="font-mono text-brand-yellow text-xs">
                  ⚠ Quiseste dizer <span className="font-bold">{emailSuggestion}</span>?
                </p>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={applyEmailSuggestion}
                    className="font-mono text-xs px-2 py-1 rounded text-black font-bold"
                    style={{ backgroundColor: '#FFD700' }}>
                    Sim
                  </button>
                  <button
                    onClick={() => setEmailSuggestion(null)}
                    className="font-mono text-xs px-2 py-1 rounded text-brand-muted border border-brand-gray2 hover:text-white transition-colors">
                    Não
                  </button>
                </div>
              </div>
            )}
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

          <p className="font-mono text-brand-muted text-xs text-center mt-1">
            Já te registaste? Abre o teu link pessoal.
          </p>
        </div>
      </div>
    </div>
  );
}
