import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNetworkErrorHandler } from '../../utils/networkErrorHandler';
import translations from '../../utils/translations';
import Header from '../header/Header';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import '../../App.css';

const Login = ({ lang }) => {
  const { user, signInWithOAuth } = useAuth();
  const { handleError } = useNetworkErrorHandler();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleProvider = async (provider) => {
    setError(null);
    setLoading(provider);
    try {
      await signInWithOAuth(provider);
      // Redirect avviene tramite Supabase; se siamo in app potrebbe servire deep link
    } catch (err) {
      setLoading(null);
      if (handleError(err, true)) return;
      const msg = translations[lang]?.authErrors?.[err.message] ?? err.message ?? 'Login failed';
      setError(msg);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="page-container login-center">
      <div className="container">
        <Header lang={lang} />
      </div>
      <h2 className="section-title">{translations[lang]?.login || 'Login'}</h2>
      <p className="login-subtitle">
        {translations[lang]?.loginSubtitle || 'Use your social account to continue'}
      </p>
      <div className="content login-providers">
        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}
        <div className="login-button-row">
          <button
            type="button"
            className="pages-button social google"
            onClick={() => handleProvider('google')}
            aria-label={translations[lang]?.signInWithGoogle || 'Sign in with Google'}
            disabled={!!loading}
          >
            <FaGoogle className="provider-icon" /> {translations[lang]?.signInWithGoogle || 'Google'}
          </button>
          <button
            type="button"
            className="pages-button social facebook"
            onClick={() => handleProvider('facebook')}
            aria-label={translations[lang]?.signInWithFacebook || 'Sign in with Facebook'}
            disabled={!!loading}
          >
            <FaFacebook className="provider-icon" /> {translations[lang]?.signInWithFacebook || 'Facebook'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
