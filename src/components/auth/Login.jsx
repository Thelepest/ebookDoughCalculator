import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNetworkErrorHandler } from '../../utils/networkErrorHandler';
import translations from '../../utils/translations';
import Header from '../header/Header';
import '../../App.css';
import { FaGoogle } from 'react-icons/fa';

const Login = ({ lang }) => {
  const { login, signInWithGoogle, resetPassword } = useAuth();
  const { handleError } = useNetworkErrorHandler();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!email || !password) {
      setError(translations[lang]?.authErrors?.['empty-fields'] || 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setLoading(false);
      // Handle network errors
      if (handleError(err, true)) {
        return; // Error handled by network error handler
      }
      let code = err?.code || '';
      if (!code && err?.message) {
        const m = err.message.match(/\((auth\/[^)]+)\)/);
        if (m && m[1]) code = m[1];
      }
      const mapped = translations[lang]?.authErrors?.[code];
      setError(mapped || err.message || 'Login failed');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!resetEmail) {
      setError(translations[lang]?.forgotPassword?.emailRequired || 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetEmail, lang);
      setSuccess(translations[lang]?.forgotPassword?.success || 'Password reset email sent! Check your inbox.');
      setResetEmail('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccess(null);
      }, 5000);
    } catch (err) {
      // Handle network errors
      if (handleError(err, true)) {
        setLoading(false);
        return; // Error handled by network error handler
      }
      let code = err?.code || '';
      if (!code && err?.message) {
        const m = err.message.match(/\((auth\/[^)]+)\)/);
        if (m && m[1]) code = m[1];
      }
      const mapped = translations[lang]?.authErrors?.[code];
      setError(mapped || err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setLoading(false);
      // Handle network errors
      if (handleError(err, true)) {
        return; // Error handled by network error handler
      }
      let code = err?.code || '';
      if (!code && err?.message) {
        const m = err.message.match(/\((auth\/[^)]+)\)/);
        if (m && m[1]) code = m[1];
      }
      const mapped = translations[lang]?.authErrors?.[code];
      setError(mapped || err.message || 'Google sign in failed');
    }
  };



  if (showForgotPassword) {
    return (
      <div className="page-container login-center">
        <div className="container">
          <Header lang={lang} />
        </div>
        <h2 className="section-title">{translations[lang]?.forgotPassword?.title || 'Reset Password'}</h2>
        <div style={{textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.95rem'}}>
          <p style={{margin: 0}}>
            {translations[lang]?.forgotPassword?.description || 'Enter your email address and we will send you a link to reset your password.'}
          </p>
        </div>
        <form onSubmit={handleForgotPassword} className="content">
          <div className="input-group">
            <label htmlFor="reset-email">{translations[lang]?.forgotPassword?.emailLabel || 'Email'}</label>
            <input 
              id="reset-email" 
              type="email" 
              placeholder={translations[lang]?.forgotPassword?.emailPlaceholder || 'Enter your email'} 
              value={resetEmail} 
              onChange={(e)=>setResetEmail(e.target.value)} 
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                boxSizing: 'border-box',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: '"Space Grotesk", sans-serif'
              }}
            />
          </div>
          {error && (
            <div style={{
              color: 'var(--color-accent-dark)', 
              marginTop: '12px', 
              padding: '10px',
              backgroundColor: '#ffebee',
              borderRadius: '4px',
              border: '1px solid #ffcdd2',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              color: 'var(--color-success)', 
              marginTop: '12px', 
              padding: '10px',
              backgroundColor: '#e0f2f1',
              borderRadius: '4px',
              border: '1px solid #b2dfdb',
              fontSize: '0.9rem'
            }}>
              {success}
            </div>
          )}
          <div className="login-button-row">
            <button className="pages-button" type="submit" disabled={!resetEmail || loading}>
              {loading ? (translations[lang]?.forgotPassword?.sending || 'Sending...') : (translations[lang]?.forgotPassword?.send || 'Send Reset Email')}
            </button>
            <button 
              type="button" 
              className="pages-button" 
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
                setSuccess(null);
                setResetEmail('');
              }}
              style={{background: 'linear-gradient(135deg, #666 0%, #444 100%)'}}
            >
              {translations[lang]?.forgotPassword?.back || 'Back to Login'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="page-container login-center">
      <div className="container">
        <Header lang={lang} />
      </div>
      <h2 className="section-title">{translations[lang]?.login || 'Login'}</h2>
      <form onSubmit={handleSubmit} className="content">
        <div className="input-group">
          <label htmlFor="email">{translations[lang]?.emailLabel || 'Email'}</label>
          <input 
            id="email" 
            type="email" 
            placeholder={translations[lang]?.emailPlaceholder || 'Email'} 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">{translations[lang]?.passwordLabel || 'Password'}</label>
          <input 
            id="password" 
            type="password" 
            placeholder={translations[lang]?.passwordPlaceholder || 'Password'} 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div style={{marginTop: '8px', marginBottom: '8px'}}>
          <button 
            type="button" 
            onClick={() => setShowForgotPassword(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary-700)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem',
              padding: 0
            }}
          >
            {translations[lang]?.forgotPassword?.link || 'Forgot password?'}
          </button>
        </div>
        {error && <div style={{color:'red', marginTop: '8px', marginBottom: '8px'}}>{error}</div>}
        {success && <div style={{color:'green', marginTop: '8px', marginBottom: '8px'}}>{success}</div>}
        <div className="login-button-row">
          <button className="pages-button" type="submit" disabled={!email || !password || loading}>
            {loading ? (translations[lang]?.loggingIn || 'Logging in...') : (translations[lang]?.login || 'Login')}
          </button>
          <button 
            type="button" 
            className="pages-button social google" 
            onClick={handleGoogle} 
            aria-label="Sign in with Google"
            disabled={loading}
          >
            <FaGoogle style={{marginRight:8,verticalAlign:'middle'}} /> Google
          </button>
        </div>
        <div style={{marginTop: '16px', textAlign: 'center'}}>
          <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)'}}>
            {translations[lang]?.noAccount || "Don't have an account?"}{' '}
            <Link 
              to="/register" 
              style={{
                color: 'var(--color-primary-700)',
                textDecoration: 'underline',
                fontWeight: 600
              }}
            >
              {translations[lang]?.register || 'Register'}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
