import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { stampsApi } from '../services/api';

interface Sponsor {
  id: string; name: string;
  boothNumber?: string; logoUrl?: string; stamped: boolean;
}

interface PassportData {
  attendee: { name: string; email: string };
  event: { name: string };
  sponsors: Sponsor[];
  progress: { collected: number; total: number };
  qualified: boolean;
}

export default function PassportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState<PassportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('passport_token');
    if (!token) { navigate('/register'); return; }

    stampsApi.getPassport(token)
      .then(res => setData(res.data))
      .catch(() => { localStorage.removeItem('passport_token'); navigate('/register'); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <p className="text-white/50">{t('common.loading')}</p>
      </div>
    );
  }

  if (!data) return null;

  const { attendee, sponsors, progress, qualified } = data;
  const pct = progress.total > 0 ? Math.round((progress.collected / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark pb-24">

      {/* Header */}
      <div className="bg-brand-mid px-6 pt-10 pb-6">
        <p className="text-white/50 text-sm mb-1">BSides Porto 2025</p>
        <h1 className="text-2xl font-bold text-white">{t('passport.title')}</h1>
        <p className="text-brand-accent font-medium mt-1">{attendee.name}</p>
      </div>

      {/* Progress */}
      <div className="px-6 py-5 bg-brand-mid border-t border-white/5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70 text-sm">
            {t('passport.progress', { collected: progress.collected, total: progress.total })}
          </span>
          <span className="text-brand-accent font-bold text-sm">{pct}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-brand-accent h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {qualified && (
          <p className="text-green-400 text-sm font-semibold mt-3 text-center">
            {t('passport.qualified')}
          </p>
        )}
      </div>

      {/* Sponsors list */}
      <div className="px-6 py-4">
        <h2 className="text-white/50 text-xs uppercase tracking-wider mb-4">
          {t('passport.sponsors_title')}
        </h2>
        <div className="flex flex-col gap-3">
          {sponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className={`flex items-center gap-4 rounded-xl px-4 py-4 border transition-all
                ${sponsor.stamped
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-white/10'}`}
            >
              {/* Stamp indicator */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0
                ${sponsor.stamped ? 'bg-green-500/20' : 'bg-white/10'}`}>
                {sponsor.stamped ? '✅' : '⬜'}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${sponsor.stamped ? 'text-white' : 'text-white/60'}`}>
                  {sponsor.name}
                </p>
                {sponsor.boothNumber && (
                  <p className="text-white/40 text-xs">Stand {sponsor.boothNumber}</p>
                )}
              </div>

              <span className={`text-xs font-medium flex-shrink-0
                ${sponsor.stamped ? 'text-green-400' : 'text-white/30'}`}>
                {sponsor.stamped ? t('passport.stamped') : t('passport.not_stamped')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scan button — fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-brand-dark border-t border-white/10">
        <button
          onClick={() => navigate('/scan')}
          className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl text-base active:scale-95 transition-transform"
        >
          📷 {t('passport.scan_cta')}
        </button>
      </div>
    </div>
  );
}
