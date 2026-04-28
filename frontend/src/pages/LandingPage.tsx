import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('passport_token');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-black relative overflow-hidden">

      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Language selector */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {['pt', 'en', 'es'].map(lang => (
          <button key={lang} onClick={() => i18n.changeLanguage(lang)}
            className={`text-xs px-3 py-1 rounded font-mono uppercase font-bold border transition-all
              ${i18n.language === lang
                ? 'bg-brand-green text-black border-brand-green shadow-neon-sm'
                : 'bg-transparent text-brand-muted border-brand-gray2 hover:border-brand-green hover:text-brand-green'}`}>
            {lang}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="text-center z-10 max-w-sm w-full">

        {/* Logo */}
        <div className="mb-6">
          <p className="font-mono text-brand-green text-sm mb-2 tracking-widest">[ SECURITY EVENT ]</p>
          <h1 className="font-mono font-bold text-white leading-none" style={{ fontSize: '3.5rem' }}>
            B<span className="text-brand-green">S</span>ides
          </h1>
          <h2 className="font-mono font-bold leading-none" style={{ fontSize: '3rem', color: '#FF4500' }}>
            Your City
          </h2>
          <p className="font-mono text-brand-yellow text-lg font-bold mt-1">2026</p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-brand-green opacity-30" />
          <span className="font-mono text-brand-green text-xs">PASSPORT</span>
          <div className="flex-1 h-px bg-brand-green opacity-30" />
        </div>

        {/* Subtitle */}
        <p className="text-brand-muted font-mono text-sm leading-relaxed mb-8">
          {t('landing.subtitle')}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate(token ? '/passport' : '/register')}
          className="w-full font-mono font-bold py-4 rounded text-black text-base uppercase tracking-widest transition-all active:scale-95 border-2"
          style={{ backgroundColor: '#00FF41', borderColor: '#00FF41', boxShadow: '0 0 20px #00FF4166' }}>
          {token ? '> Ver o meu Passport' : `> ${t('landing.cta')}`}
        </button>

        {/* Event info */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="border border-brand-gray2 rounded p-3 text-left">
            <p className="font-mono text-brand-green text-xs mb-1">WHEN</p>
            <p className="font-mono text-white text-xs">Jun 26-27, 2026</p>
          </div>
          <div className="border border-brand-gray2 rounded p-3 text-left">
            <p className="font-mono text-brand-green text-xs mb-1">WHERE</p>
            <p className="font-mono text-white text-xs">Your Venue</p>
          </div>
        </div>
        {/* Recover session */}
          <p className="mt-4 font-mono text-brand-muted text-xs text-center">
            Já te registaste? Abre o teu link pessoal para recuperar o passport.
          </p>
      </div>

      {/* Footer */}
      <p className="absolute bottom-4 font-mono text-brand-muted text-xs">
        BSides Your City 2026 · Powered by Cross-Intel
      </p>
    </div>
  );
}