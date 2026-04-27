import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const token = localStorage.getItem('passport_token');
  const link = `${window.location.origin}/r/${token}`;

  useEffect(() => {
    if (!token) { navigate('/register'); return; }
    const n = localStorage.getItem('passport_name');
    if (n) setName(n);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback para dispositivos mais antigos
      const el = document.createElement('input');
      el.value = link;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-brand-black relative">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">

        {/* Header */}
        <div>
          <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ REGISTO COMPLETO ]</p>
          <h1 className="font-mono font-bold text-white text-2xl mb-1">
            Bem-vindo{name ? `, ${name.split(' ')[0]}` : ''}!
          </h1>
          <p className="font-mono text-brand-muted text-sm">Your Event 2026</p>
        </div>

        {/* Link pessoal */}
        <div className="border border-brand-green rounded p-5 flex flex-col gap-3"
          style={{ boxShadow: '0 0 16px #00FF4122' }}>
          <p className="font-mono text-brand-green text-xs tracking-widest">[ O TEU LINK PESSOAL ]</p>
          <p className="font-mono text-brand-muted text-xs leading-relaxed">
            Guarda este link. Se fechares o browser ou mudares de dispositivo, abre-o para recuperar o teu passport com todos os stamps.
          </p>
          <div className="bg-brand-gray border border-brand-gray2 rounded px-3 py-2">
            <p className="font-mono text-brand-green text-xs break-all">{link}</p>
          </div>
          <button
            onClick={handleCopy}
            className="w-full font-mono font-bold py-3 rounded text-black text-xs uppercase tracking-widest active:scale-95 transition-all border-2"
            style={{
              backgroundColor: copied ? '#00CC33' : '#00FF41',
              borderColor: copied ? '#00CC33' : '#00FF41',
              boxShadow: '0 0 12px #00FF4144'
            }}>
            {copied ? '✓ Link copiado!' : '> Copiar link'}
          </button>
          <button
            onClick={() => {
              // Abre o link para o utilizador guardar nos favoritos
              window.open(link, '_blank');
            }}
            className="w-full font-mono py-2 rounded text-brand-muted text-xs uppercase tracking-widest border border-brand-gray2 hover:border-brand-green hover:text-brand-green transition-colors">
            ☆ Guardar nos favoritos
          </button>
        </div>

        {/* Aviso */}
        <div className="border border-brand-yellow rounded px-4 py-3"
          style={{ boxShadow: '0 0 8px #FFD70011' }}>
          <p className="font-mono text-brand-yellow text-xs leading-relaxed">
            ⚠ Não partilhes este link com ninguém — é o teu acesso pessoal ao passport.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => { window.location.href = '/passport'; }}
          className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest active:scale-95 transition-all border-2"
          style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4555' }}>
          {'>'} Ir para o meu Passport
        </button>

      </div>
    </div>
  );
}