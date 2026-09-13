import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AuthPrompt({ open, onClose, from }) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="auth-prompt-backdrop" onClick={onClose} role="presentation">
      <div
        className="auth-prompt-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="auth-prompt-title">{t('auth.promptTitle')}</h2>
        <p>{t('auth.promptBody')}</p>
        <div className="row">
          <Link className="btn" to="/login" state={{ from }} onClick={onClose}>
            {t('auth.login')}
          </Link>
          <Link className="btn ghost" to="/register" state={{ from }} onClick={onClose}>
            {t('auth.createAccount')}
          </Link>
        </div>
        <button type="button" className="header-text-link" onClick={onClose}>
          {t('auth.continueBrowsing')}
        </button>
      </div>
    </div>
  );
}
