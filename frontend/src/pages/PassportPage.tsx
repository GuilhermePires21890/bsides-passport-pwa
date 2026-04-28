import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { stampsApi } from '../services/api';

interface Sponsor {
  id: string; name: string;
  boothNumber?: string; logoUrl?: string; stamped: boolean;
}

interface PassportData {
  attendee: { name: string; company?: string };
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
    const token = sessionStorage.getItem('passport_token');
    if (!token) { navigate('/register'); return; }
    stampsApi.getPassport()
      .then(res => setData(res.data))
      .catch(() => { sessionStorage.removeItem('passport_token'); navigate('/register'); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <p className="font-mono text-brand-green animate-pulse">{'>'} A carregar...</p>
    </div>
  );

  if (!data) return null;

  const { attendee, sponsors, progress, qualified } = data;
  const pct = progress.total > 0 ? Math.round((progress.collected / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-brand-black pb-28">

    {/* Header */}
    <div className="px-6 pt-10 pb-5 border-b border-brand-gray2 flex justify-between items-start">
      <div>
        <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ PASSPORT ]</p>
        <h1 className="font-mono font-bold text-white text-2xl">BSides Your City 2026</h1>
        <p className="font-mono text-brand-green text-sm mt-1">{attendee.name}</p>
      </div>
      <button
        onClick={() => {
          sessionStorage.removeItem('passport_token');
          navigate('/');
        }}
        className="font-mono text-brand-muted text-xs border border-brand-gray2 px-3 py-1 rounded hover:border-brand-red hover:text-brand-red transition-colors">
        Sair
      </button>
    </div>

      {/* Progress */}
      <div className="px-6 py-5 border-b border-brand-gray2">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-brand-muted text-xs">
            {t('passport.progress', { collected: progress.collected, total: progress.total })}
          </span>
          <span className="font-mono text-brand-green font-bold text-sm">{pct}%</span>
        </div>
        <div className="w-full bg-brand-gray2 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: '#00FF41', boxShadow: pct > 0 ? '0 0 8px #00FF41' : 'none' }} />
        </div>
        {qualified && (
          <div className="mt-3 border border-brand-green rounded p-3 text-center"
            style={{ boxShadow: '0 0 12px #00FF4133' }}>
            <p className="font-mono text-brand-green text-sm font-bold">
              ✓ {t('passport.qualified')}
            </p>
          </div>
        )}
      </div>

      {/* Sponsors */}
      <div className="px-6 py-4">
        <p className="font-mono text-brand-muted text-xs uppercase tracking-widest mb-4">
          {'>'} {t('passport.sponsors_title')}
        </p>
        <div className="flex flex-col gap-3">
          {sponsors.map(sponsor => (
            <div key={sponsor.id}
              className={`flex items-center gap-4 rounded px-4 py-4 border transition-all
                ${sponsor.stamped
                  ? 'border-brand-green bg-brand-gray'
                  : 'border-brand-gray2 bg-brand-gray'}`}
              style={sponsor.stamped ? { boxShadow: '0 0 8px #00FF4133' } : {}}>

              {/* Status indicator */}
              <div className={`w-8 h-8 rounded flex items-center justify-center font-mono text-sm flex-shrink-0 border
                ${sponsor.stamped ? 'border-brand-green text-brand-green' : 'border-brand-gray2 text-brand-muted'}`}>
                {sponsor.stamped ? '✓' : '○'}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-mono font-bold text-sm truncate ${sponsor.stamped ? 'text-white' : 'text-brand-muted'}`}>
                  {sponsor.name}
                </p>
                {sponsor.boothNumber && (
                  <p className="font-mono text-brand-muted text-xs">Stand {sponsor.boothNumber}</p>
                )}
              </div>

              <span className={`font-mono text-xs flex-shrink-0 ${sponsor.stamped ? 'text-brand-green' : 'text-brand-gray2'}`}>
                {sponsor.stamped ? t('passport.stamped') : t('passport.not_stamped')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scan button fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-brand-black border-t border-brand-gray2">
        <button onClick={() => navigate('/scan')}
          className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest active:scale-95 transition-all border-2"
          style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 20px #00FF4155' }}>
          {'>'} {t('passport.scan_cta')}
        </button>
      </div>
    </div>
  );
}