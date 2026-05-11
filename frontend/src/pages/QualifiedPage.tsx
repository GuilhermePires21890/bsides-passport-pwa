import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function QualifiedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-brand-black relative overflow-hidden">

      <div className="absolute inset-0 opacity-5 bg-grid-brand" />

      <div className="relative z-10 max-w-xs w-full">
        <div className="border-2 border-brand-green rounded p-8 mb-8 shadow-neon">
          <p className="font-mono text-brand-green text-xs tracking-widest mb-4">[ QUALIFICADO ]</p>
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="font-mono font-bold text-white text-2xl mb-3">{t('qualified.title')}</h1>
          <p className="font-mono text-brand-muted text-sm leading-relaxed">
            {t('qualified.message')}
          </p>
        </div>

        <button onClick={() => navigate('/passport')}
          className="w-full font-mono font-bold py-4 rounded text-black text-sm uppercase tracking-widest active:scale-95 transition-all border-2 bg-brand-green border-brand-green shadow-neon hover:bg-brand-green2 hover:border-brand-green2">
          {'>'} {t('qualified.back')}
        </button>
      </div>
    </div>
  );
}
