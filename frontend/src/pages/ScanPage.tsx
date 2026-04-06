import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Html5Qrcode } from 'html5-qrcode';
import { stampsApi } from '../services/api';

type ScanStatus = 'scanning' | 'success' | 'duplicate' | 'error';

export default function ScanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<ScanStatus>('scanning');
  const [sponsorName, setSponsorName] = useState('');
  const [progress, setProgress] = useState<{ collected: number; total: number } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('passport_token');
    if (!token) { navigate('/register'); return; }

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (qrCode) => {
        // Stop scanner immediately after successful read
        await scanner.stop();

        try {
          const res = await stampsApi.scan(token, qrCode);
          setSponsorName(res.data.sponsorName);
          setProgress(res.data.progress);
          setStatus('success');

          if (res.data.qualified) {
            setTimeout(() => navigate('/qualified'), 2000);
          }
        } catch (err: any) {
          if (err?.response?.status === 409) {
            setStatus('duplicate');
          } else {
            setStatus('error');
          }
        }
      },
      () => {} // Ignore QR not found frames
    ).catch(() => setStatus('error'));

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark">

      {/* Header */}
      <div className="px-6 pt-10 pb-4 bg-brand-mid">
        <button onClick={() => navigate('/passport')} className="text-white/50 text-sm mb-4 block">
          ← {t('scan.back')}
        </button>
        <h1 className="text-2xl font-bold text-white">{t('scan.title')}</h1>
        <p className="text-white/50 text-sm mt-1">{t('scan.instruction')}</p>
      </div>

      {/* Scanner */}
      {status === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-brand-accent/50">
            <div id="qr-reader" className="w-full" />
          </div>
          <p className="text-white/40 text-xs mt-4 text-center">
            Aponta para o QR code do estande
          </p>
        </div>
      )}

      {/* Success */}
      {status === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-xl font-bold text-white">{t('scan.success')}</h2>
          <p className="text-brand-accent font-semibold text-lg">{sponsorName}</p>
          {progress && (
            <p className="text-white/50 text-sm">
              {t('passport.progress', { collected: progress.collected, total: progress.total })}
            </p>
          )}
          <button
            onClick={() => navigate('/passport')}
            className="mt-6 bg-brand-accent text-white font-semibold px-8 py-3 rounded-xl"
          >
            {t('scan.back')}
          </button>
        </div>
      )}

      {/* Duplicate */}
      {status === 'duplicate' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">{t('scan.already_scanned')}</h2>
          <button
            onClick={() => navigate('/passport')}
            className="mt-6 bg-white/10 text-white font-semibold px-8 py-3 rounded-xl"
          >
            {t('scan.back')}
          </button>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-xl font-bold text-white">{t('scan.invalid')}</h2>
          <button
            onClick={() => navigate('/passport')}
            className="mt-6 bg-white/10 text-white font-semibold px-8 py-3 rounded-xl"
          >
            {t('scan.back')}
          </button>
        </div>
      )}
    </div>
  );
}
