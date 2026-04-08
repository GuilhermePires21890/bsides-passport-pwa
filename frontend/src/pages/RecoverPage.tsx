import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, eventsApi } from '../services/api';

type Step = 'email' | 'code' | 'success';

export default function RecoverPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [eventId, setEventId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    eventsApi.getActive()
      .then(res => setEventId(res.data.id))
      .catch(() => setError('Nenhum evento activo encontrado.'));
  }, []);

  const handleSendCode = async () => {
    if (!email) { setError('Introduz o teu email.'); return; }
    setLoading(true);
    setError('');
    try {
      await authApi.sendRecoveryCode(email, eventId);
      setStep('code');
    } catch {
      setError('Erro ao enviar o código. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) { setError('Introduz o código recebido.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await authApi.verifyRecoveryCode(email, eventId, code);
        localStorage.setItem('passport_token', res.data.token);
        setStep('success');
        setTimeout(() => { window.location.href = '/passport'; }, 2000);
    } catch {
      setError('Código inválido ou expirado. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-brand-black relative">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-md">
        <button onClick={() => navigate('/')}
          className="font-mono text-brand-green text-sm mb-8 block hover:text-white transition-colors">
          ← Voltar
        </button>

        <p className="font-mono text-brand-green text-xs tracking-widest mb-1">[ RECUPERAR SESSÃO ]</p>
        <h1 className="font-mono font-bold text-white text-2xl mb-1">Recupera o teu Passport</h1>
        <p className="font-mono text-brand-muted text-sm mb-8">BSides Porto 2026</p>

        {/* STEP 1 — Email */}
        {step === 'email' && (
          <div className="flex flex-col gap-4">
            <p className="font-mono text-brand-muted text-sm">
              Introduz o email com que te registaste. Vamos enviar-te um código de 6 dígitos.
            </p>
            <div>
              <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} Email</label>
              <input
                type="email"
                placeholder="o.teu@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-brand-gray text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors"
              />
            </div>
            {error && <p className="font-mono text-brand-red text-sm">{error}</p>}
            <button onClick={handleSendCode} disabled={loading || !eventId}
              className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest mt-2 disabled:opacity-40 active:scale-95 transition-all border-2"
              style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4155' }}>
              {loading ? '> A enviar...' : '> Enviar código'}
            </button>
          </div>
        )}

        {/* STEP 2 — Code */}
        {step === 'code' && (
          <div className="flex flex-col gap-4">
            <div className="border border-brand-green rounded p-4"
              style={{ boxShadow: '0 0 10px #00FF4122' }}>
              <p className="font-mono text-brand-green text-xs mb-1">✓ Código enviado</p>
              <p className="font-mono text-brand-muted text-sm">
                Verifica o email <span className="text-white font-bold">{email}</span>
              </p>
            </div>
            <div>
              <label className="font-mono text-brand-green text-xs mb-1 block">{'>'} Código de 6 dígitos</label>
              <input
                type="text"
                placeholder="ABC123"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                maxLength={6}
                className="w-full bg-brand-gray text-white placeholder-brand-muted rounded px-4 py-3 text-sm font-mono outline-none border border-brand-gray2 focus:border-brand-green transition-colors tracking-widest text-center text-lg"
              />
            </div>
            {error && <p className="font-mono text-brand-red text-sm">{error}</p>}
            <button onClick={handleVerifyCode} disabled={loading}
              className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest disabled:opacity-40 active:scale-95 transition-all border-2"
              style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 16px #00FF4155' }}>
              {loading ? '> A verificar...' : '> Confirmar código'}
            </button>
            <button onClick={() => { setStep('email'); setError(''); setCode(''); }}
              className="font-mono text-brand-muted text-xs text-center hover:text-brand-green transition-colors">
              ← Usar outro email
            </button>
          </div>
        )}

        {/* STEP 3 — Success */}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="border-2 border-brand-green rounded p-8 w-full"
              style={{ boxShadow: '0 0 30px #00FF4144' }}>
              <p className="font-mono text-brand-green text-4xl mb-3">✓</p>
              <h2 className="font-mono font-bold text-white text-xl mb-2">Sessão recuperada!</h2>
              <p className="font-mono text-brand-muted text-sm animate-pulse">
                A redirigir para o teu passport...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}