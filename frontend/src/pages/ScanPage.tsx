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
  const startedRef = useRef(false);
  const [status, setStatus] = useState<ScanStatus>('scanning');
  const [sponsorName, setSponsorName] = useState('');
  const [progress, setProgress] = useState<{ collected: number; total: number } | null>(null);

useEffect(() => {
  const token = localStorage.getItem('passport_token');
  if (!token) { navigate('/register'); return; }
  if (startedRef.current) return;

  // Force error state if not HTTPS (camera requires HTTPS on mobile)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    setStatus('error');
    return;
  }

  startedRef.current = true;

  const scanner = new Html5Qrcode('qr-reader');
  scannerRef.current = scanner;
    Html5Qrcode.getCameras().then(cameras => {
      if (!cameras || cameras.length === 0) { setStatus('error'); return; }

      const cameraId = cameras.length > 1
        ? cameras.find(c => c.label.toLowerCase().includes('back') ||
            c.label.toLowerCase().includes('rear'))?.id || cameras[0].id
        : cameras[0].id;

      scanner.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (qrCode) => {
          try { await scanner.stop(); } catch {}
          const token = localStorage.getItem('passport_token');
          if (!token) return;
          try {
            const res = await stampsApi.scan(token, qrCode);
            setSponsorName(res.data.sponsorName);
            setProgress(res.data.progress);
            setStatus('success');
            if (res.data.qualified) setTimeout(() => navigate('/qualified'), 2000);
          } catch (err: any) {
            if (err?.response?.status === 409) setStatus('duplicate');
            else setStatus('error');
          }
        },
        () => {}
      ).catch(() => setStatus('error'));
    }).catch(() => setStatus('error'));

    return () => { scannerRef.current?.stop().catch(() => {}); };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark">
      <div className="px-6 pt-10 pb-4 bg-brand-mid">
        <button onClick={() => { scannerRef.current?.stop().catch(() => {}); navigate('/passport'); }}
          className="text-white/50 text-sm mb-4 block">
          ← {t('scan.back')}
        </button>
        <h1 className="text-2xl font-bold text-white">{t('scan.title')}</h1>
        <p className="text-white/50 text-sm mt-1">{t('scan.instruction')}</p>
      </div>

      {status === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div id="qr-reader" className="w-full max-w-sm rounded-2xl overflow-hidden border-2 border-brand-accent/50" style={{ minHeight: '300px' }} />
          <p className="text-white/40 text-xs mt-4 text-center">{t('scan.instruction')}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-xl font-bold text-white">{t('scan.success')}</h2>
          <p className="text-brand-accent font-semibold text-lg">{sponsorName}</p>
          {progress && <p className="text-white/50 text-sm">{t('passport.progress', { collected: progress.collected, total: progress.total })}</p>}
          <button onClick={() => navigate('/passport')} className="mt-6 bg-brand-accent text-white font-semibold px-8 py-3 rounded-xl">{t('scan.back')}</button>
        </div>
      )}

      {status === 'duplicate' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="text-6xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">{t('scan.already_scanned')}</h2>
          <button onClick={() => navigate('/passport')} className="mt-6 bg-white/10 text-white font-semibold px-8 py-3 rounded-xl">{t('scan.back')}</button>
        </div>
      )}

{status === 'error' && (
  <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
    <div className="text-6xl">📷</div>
    <h2 className="text-xl font-bold text-white">Testar QR Code</h2>
    <p className="text-white/50 text-sm max-w-xs">Cola o código do sponsor e carrega Confirmar.</p>
    <input
      id="qr-input"
      type="text"
      placeholder="Cola o QR code aqui..."
      className="w-full max-w-xs bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-accent"
    />
    <button
      onClick={async () => {
        const input = document.getElementById('qr-input') as HTMLInputElement;
        const qrCode = input?.value.trim();
        const token = localStorage.getItem('passport_token');
        if (!token || !qrCode) return;
        try {
          const res = await stampsApi.scan(token, qrCode);
          setSponsorName(res.data.sponsorName);
          setProgress(res.data.progress);
          setStatus('success');
          if (res.data.qualified) setTimeout(() => navigate('/qualified'), 2000);
        } catch (err: any) {
          if (err?.response?.status === 409) setStatus('duplicate');
        }
      }}
      className="w-full max-w-xs bg-brand-accent text-white font-semibold py-3 rounded-xl"
    >
      Confirmar
    </button>
    <button onClick={() => navigate('/passport')} className="bg-white/10 text-white font-semibold px-8 py-3 rounded-xl">
      {t('scan.back')}
    </button>
  </div>
)}
    </div>
  );
}