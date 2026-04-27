import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, eventsApi } from '../../services/api';
import QRCode from 'qrcode';

interface Sponsor {
  id: string; name: string;
  boothNumber?: string; qrCode: string; scanCount: number;
}

export default function QRCodesPage() {
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('staff_token');
    if (!token) { navigate('/admin'); return; }

    eventsApi.getActive().then(res => {
      return adminApi.getSponsorScans(res.data.id);
    }).then(async res => {
      const list: Sponsor[] = res.data;
      setSponsors(list);

      const images: Record<string, string> = {};
      for (const s of list) {
        images[s.id] = await QRCode.toDataURL(s.qrCode, {
          width: 500, margin: 2,
          color: { dark: '#000000', light: '#ffffff' }
        });
      }
      setQrImages(images);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <p className="font-mono text-brand-green animate-pulse">{'>'} A gerar QR codes...</p>
    </div>
  );

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page {
            page-break-after: always;
            break-after: page;
            width: 100%;
            min-height: 100vh;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white;
            padding: 40px;
            box-sizing: border-box;
          }
          .print-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }
          .screen-only { display: none !important; }
        }
        @media screen {
          .print-page { display: none; }
        }
      `}</style>

      <div className="min-h-screen bg-brand-black">

        {/* Header */}
        <div className="no-print px-6 pt-8 pb-4 border-b border-brand-gray2 flex justify-between items-center">
          <div>
            <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ QR CODES ]</p>
            <h1 className="font-mono font-bold text-white text-xl">QR Codes para Impressão</h1>
            <p className="font-mono text-brand-muted text-sm">{sponsors.length} sponsors · 1 folha por sponsor</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/admin/dashboard')}
              className="font-mono text-brand-muted text-xs border border-brand-gray2 px-3 py-2 rounded hover:border-brand-green hover:text-brand-green transition-colors">
              ← Voltar
            </button>
            <button onClick={() => window.print()}
              className="font-mono font-bold text-xs px-4 py-2 rounded text-black uppercase tracking-wider"
              style={{ backgroundColor: '#00FF41', boxShadow: '0 0 10px #00FF4144' }}>
              🖨️ Imprimir
            </button>
          </div>
        </div>

        {/* Screen preview */}
        <div className="screen-only p-8 flex flex-col gap-8 items-center">
          {sponsors.map(sponsor => (
            <div key={sponsor.id}
              className="border-2 border-brand-green rounded-lg p-8 flex flex-col items-center text-center w-full max-w-sm"
              style={{ boxShadow: '0 0 15px #00FF4133' }}>
              <p className="font-mono text-brand-green text-xs tracking-widest mb-1">BSides Porto 2026</p>
              <h2 className="font-mono font-bold text-white text-2xl mb-1">{sponsor.name}</h2>
              {sponsor.boothNumber && (
                <p className="font-mono text-brand-muted text-sm mb-4">Stand {sponsor.boothNumber}</p>
              )}
              {qrImages[sponsor.id] && (
                <div className="bg-white p-3 rounded-lg mb-4">
                  <img src={qrImages[sponsor.id]} alt={`QR ${sponsor.name}`} className="w-56 h-56" />
                </div>
              )}
              <p className="font-mono text-brand-muted text-xs leading-relaxed">
                Scana o QR code com o teu<br />Passport BSides Porto 2026
              </p>
            </div>
          ))}
        </div>

        {/* Print layout — 1 per page */}
        {sponsors.map(sponsor => (
          <div key={`print-${sponsor.id}`} className="print-page">
            <p style={{ fontFamily: 'monospace', fontSize: '13px', letterSpacing: '4px', color: '#555', marginBottom: '12px', textTransform: 'uppercase' }}>
              BSides Porto 2026
            </p>
            <h2 style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '40px', marginBottom: '8px', color: '#000', textAlign: 'center' }}>
              {sponsor.name}
            </h2>
            {sponsor.boothNumber && (
              <p style={{ fontFamily: 'monospace', fontSize: '20px', color: '#555', marginBottom: '40px' }}>
                Stand {sponsor.boothNumber}
              </p>
            )}
            {qrImages[sponsor.id] && (
              <div style={{ padding: '20px', background: 'white', border: '4px solid #000', borderRadius: '12px', marginBottom: '32px' }}>
                <img src={qrImages[sponsor.id]} alt={`QR ${sponsor.name}`} style={{ width: '350px', height: '350px', display: 'block' }} />
              </div>
            )}
            <p style={{ fontFamily: 'monospace', fontSize: '15px', color: '#555', textAlign: 'center', lineHeight: '1.8' }}>
              Scana o QR code com o teu<br />Passport BSides Porto 2026
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '9px', color: '#bbb', marginTop: '20px', textAlign: 'center' }}>
              {sponsor.qrCode}
            </p>
          </div>
        ))}

      </div>
    </>
  );
}
