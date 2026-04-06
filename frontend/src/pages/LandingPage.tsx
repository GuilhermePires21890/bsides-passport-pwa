import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem('passport_token');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-dark">

      {/* Language selector */}
      <div className="absolute top-4 right-4 flex gap-2">
        {['pt', 'en', 'es'].map(lang => (
          <button
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            className={`text-xs px-2 py-1 rounded uppercase font-semibold transition-colors
              ${i18n.language === lang
                ? 'bg-brand-accent text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Logo / Header */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🛂</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Passport
        </h1>
        <p className="text-brand-accent font-semibold text-lg">BSides Porto 2025</p>
      </div>

      {/* Subtitle */}
      <p className="text-white/70 text-center text-base max-w-xs mb-10 leading-relaxed">
        {t('landing.subtitle')}
      </p>

      {/* CTA */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {token ? (
          <button
            onClick={() => navigate('/passport')}
            className="w-full bg-brand-accent text-white font-semibold py-4 rounded-xl text-base active:scale-95 transition-transform"
          >
            Ver o meu Passport →
          </button>
        ) : (
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-brand-accent text-white font-semibold py-4 rounded-xl text-base active:scale-95 transition-transform"
          >
            {t('landing.cta')} →
          </button>
        )}
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-white/30 text-xs">
        BSides Porto 2025 · Powered by Cross-Intel
      </p>
    </div>
  );
}
