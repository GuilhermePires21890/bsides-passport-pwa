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

  const handleManualScan = async (qrCode: string) => {
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-black">

      {/* Header */}
      <div className="px-6 pt-10 pb-4 border-b border-brand-gray2">
        <button onClick={() => { scannerRef.current?.stop().catch(() => {}); navigate('/passport'); }}
          className="font-mono text-brand-green text-sm mb-4 block hover:text-white transition-colors">
          ← {t('scan.back')}
        </button>
        <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ QR SCAN ]</p>
        <h1 className="font-mono font-bold text-white text-2xl">{t('scan.title')}</h1>
        <p className="font-mono text-brand-muted text-sm mt-1">{t('scan.instruction')}</p>
      </div>

      {/* Scanning */}
      {status === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div id="qr-reader"
            className="w-full max-w-sm rounded overflow-hidden border-2 border-brand-green"
            style={{ minHeight: '300px', boxShadow: '0 0 20px #00FF4133' }} />
          <p className="font-mono text-brand-muted text-xs mt-4 text-center">{t('scan.instruction')}</p>
        </div>
      )}

      {/* Success */}
      {status === 'success' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="border-2 border-brand-green rounded p-8 w-full max-w-xs"
            style={{ boxShadow: '0 0 30px #00FF4144' }}>
            <p className="font-mono text-brand-green text-4xl mb-3">✓</p>
            <h2 className="font-mono font-bold text-white text-xl mb-2">{t('scan.success')}</h2>
            <p className="font-mono text-brand-green font-bold text-lg">{sponsorName}</p>
            {progress && (
              <p className="font-mono text-brand-muted text-sm mt-2">
                {t('passport.progress', { collected: progress.collected, total: progress.total })}
              </p>
            )}
          </div>
          <button onClick={() => navigate('/passport')}
            className="w-full max-w-xs font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest active:scale-95 transition-all border-2"
            style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4555' }}>
            {'>'} {t('scan.back')}
          </button>
        </div>
      )}

      {/* Duplicate */}
      {status === 'duplicate' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="border-2 border-brand-yellow rounded p-8 w-full max-w-xs"
            style={{ boxShadow: '0 0 20px #FFD70033' }}>
            <p className="font-mono text-brand-yellow text-4xl mb-3">⚠</p>
            <h2 className="font-mono font-bold text-white text-xl">{t('scan.already_scanned')}</h2>
          </div>
          <button onClick={() => navigate('/passport')}
            className="w-full max-w-xs font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest active:scale-95 transition-all border-2"
            style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4555' }}>
            {'>'} {t('scan.back')}
          </button>
        </div>
      )}

      {/* Error / Manual input */}
      {status === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="border border-brand-gray2 rounded p-6 w-full max-w-xs">
            <p className="font-mono text-brand-green text-xs tracking-widest mb-4">[ MANUAL INPUT ]</p>
            <p className="font-mono text-brand-muted text-sm mb-4">
              Cola o código do sponsor e carrega Confirmar.
            </p>
            <input id="qr-input" type="text" placeholder="QR code do sponsor..."
              className="w-full bg-brand-gray text-white placeholder-brand-muted rounded px-3 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors mb-3" />
            <button
              onClick={() => {
                const input = document.getElementById('qr-input') as HTMLInputElement;
                handleManualScan(input?.value.trim());
              }}
              className="w-full font-mono font-bold py-3 rounded text-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              style={{ backgroundColor: '#00FF41', boxShadow: '0 0 10px #00FF4144' }}>
              {'>'} Confirmar
            </button>
          </div>
          <button onClick={() => navigate('/passport')}
            className="font-mono text-brand-muted text-sm hover:text-brand-green transition-colors">
            ← {t('scan.back')}
          </button>
        </div>
      )}
    </div>
  );
}