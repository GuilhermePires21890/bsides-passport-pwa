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
  const appUrl = window.location.origin;

  useEffect(() => {
    const token = localStorage.getItem('staff_token');
    if (!token) { navigate('/admin'); return; }

    eventsApi.getActive().then(res => {
      return adminApi.getSponsorScans(res.data.id);
    }).then(async res => {
      const list: Sponsor[] = res.data;
      setSponsors(list);

      // Generate QR code images
      const images: Record<string, string> = {};
      for (const s of list) {
        images[s.id] = await QRCode.toDataURL(s.qrCode, {
          width: 300, margin: 2,
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
    <div className="min-h-screen bg-brand-black">

      {/* Header — hidden on print */}
      <div className="px-6 pt-8 pb-4 border-b border-brand-gray2 flex justify-between items-center print:hidden">
        <div>
          <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ QR CODES ]</p>
          <h1 className="font-mono font-bold text-white text-xl">QR Codes para Impressão</h1>
          <p className="font-mono text-brand-muted text-sm">{sponsors.length} sponsors</p>
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

      {/* QR Grid */}
      <div className="p-8 grid grid-cols-2 gap-8 print:grid-cols-2 print:gap-6 print:p-4"
        style={{ maxWidth: '900px', margin: '0 auto' }}>
        {sponsors.map(sponsor => (
          <div key={sponsor.id}
            className="border-2 border-brand-green rounded-lg p-6 flex flex-col items-center text-center print:border-black print:break-inside-avoid"
            style={{ boxShadow: '0 0 15px #00FF4133' }}>

            {/* Event name */}
            <p className="font-mono text-brand-green text-xs tracking-widest mb-1 print:text-black">
              BSides Porto 2026
            </p>

            {/* Sponsor name */}
            <h2 className="font-mono font-bold text-white text-xl mb-1 print:text-black">
              {sponsor.name}
            </h2>

            {/* Booth number */}
            {sponsor.boothNumber && (
              <p className="font-mono text-brand-muted text-sm mb-4 print:text-gray-600">
                Stand {sponsor.boothNumber}
              </p>
            )}

            {/* QR Code */}
            {qrImages[sponsor.id] && (
              <div className="bg-white p-3 rounded-lg mb-4">
                <img src={qrImages[sponsor.id]} alt={`QR ${sponsor.name}`}
                  className="w-48 h-48" />
              </div>
            )}

            {/* Instruction */}
            <p className="font-mono text-brand-muted text-xs leading-relaxed print:text-gray-500">
              Scana o QR code com o teu<br />Passport BSides Porto 2026
            </p>

            {/* QR value (small, for reference) */}
            <p className="font-mono text-brand-gray2 text-xs mt-2 break-all print:text-gray-300"
              style={{ fontSize: '9px' }}>
              {sponsor.qrCode}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}