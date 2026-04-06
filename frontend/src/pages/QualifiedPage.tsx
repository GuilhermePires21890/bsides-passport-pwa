import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function QualifiedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-brand-dark">
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-white mb-3">{t('qualified.title')}</h1>
      <p className="text-white/60 text-base leading-relaxed max-w-xs mb-10">
        {t('qualified.message')}
      </p>
      <button
        onClick={() => navigate('/passport')}
        className="bg-brand-accent text-white font-semibold px-8 py-4 rounded-xl text-base active:scale-95 transition-transform"
      >
        {t('qualified.back')}
      </button>
    </div>
  );
}
