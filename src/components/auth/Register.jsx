import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import translations from '../../utils/translations';
import Header from '../header/Header';
import PrivacyPolicy from '../privacy/PrivacyPolicy';
import Spinner from '../spinner/Spinner';
import '../../App.css';
import { FaGoogle } from 'react-icons/fa';

const Register = ({ lang }) => {
  const { signup, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [pendingPrivacy, setPendingPrivacy] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();

  // Controlla se l'utente ha già accettato privacy/terms
  useEffect(() => {
    if (user) {
      // Controlla prima localStorage (cache veloce)
      const privacyAccepted = localStorage.getItem(`privacy_accepted_${user.id}`);
      const privacyVersion = localStorage.getItem(`privacy_version_${user.id}`);
      const currentVersion = '1.0'; // Versione attuale della privacy policy
      
      // Se non accettata o versione diversa, mostra la privacy policy
      if (!privacyAccepted || privacyVersion !== currentVersion) {
        setShowPrivacy(true);
        setPendingPrivacy(false);
      } else if (pendingPrivacy) {
        setPendingPrivacy(false);
        navigate('/');
      }
    }
  }, [user, pendingPrivacy, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || !confirmPassword) {
      setError(translations[lang]?.authErrors?.['empty-fields'] || 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError(translations[lang]?.registerForm?.passwordMismatch || 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError(translations[lang]?.authErrors?.['auth/weak-password'] || 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await signup(email, password);
      setLoading(false);
      if (!data?.session) {
        setSuccess(translations[lang]?.registerForm?.confirmEmail || 'Registration successful. Please check your email to confirm your account.');
        return;
      }
      setPendingPrivacy(true);
      setShowPrivacy(true);
      return;
    } catch (err) {
      setLoading(false);
      const mapped =
        translations[lang]?.authErrors?.[err.code] ||
        translations[lang]?.authErrors?.[err.message];
      setError(mapped || err.message || 'Registration failed');
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      setLoading(false);
      setPendingPrivacy(true);
      setShowPrivacy(true);
      return;
    } catch (err) {
      setLoading(false);
      const mapped = translations[lang]?.authErrors?.[err.message];
      setError(mapped || err.message || 'Google sign up failed');
    }
  };

  const handlePrivacyAccept = () => {
    setShowSpinner(true);
    setTimeout(() => {
      setShowSpinner(false);
      navigate('/');
    }, 900); // 0.9 secondi
  };

  // Mostra Privacy Policy se necessario
  if (showPrivacy) {
    return (
      <>
        <PrivacyPolicy lang={lang} onAccept={handlePrivacyAccept} />
        {showSpinner && <Spinner />}
      </>
    );
  }

  return (
    <div className="page-container login-center">
      <div className="container">
        <Header lang={lang} />
      </div>
      <h2 className="section-title">{translations[lang]?.register || 'Register'}</h2>
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
            placeholder={translations[lang]?.passwordPlaceholder || 'Password (min. 6 characters)'} 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">{translations[lang]?.registerForm?.confirmPassword || 'Confirm Password'}</label>
          <input 
            id="confirmPassword" 
            type="password" 
            placeholder={translations[lang]?.registerForm?.confirmPasswordPlaceholder || 'Confirm Password'} 
            value={confirmPassword} 
            onChange={(e)=>setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>
        {error && <div style={{color:'red', marginTop: '8px', marginBottom: '8px'}}>{error}</div>}
        {success && <div style={{color:'green', marginTop: '8px', marginBottom: '8px'}}>{success}</div>}
        <div className="login-button-row">
          <button className="pages-button" type="submit" disabled={!email || !password || !confirmPassword || loading}>
            {loading ? (translations[lang]?.registerForm?.registering || 'Registering...') : (translations[lang]?.register || 'Register')}
          </button>
          <button 
            type="button" 
            className="pages-button social google" 
            onClick={handleGoogle} 
            aria-label="Sign up with Google"
            disabled={loading}
          >
            <FaGoogle style={{marginRight:8,verticalAlign:'middle'}} /> Google
          </button>
        </div>
        <div style={{marginTop: '16px', textAlign: 'center'}}>
          <p style={{margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)'}}>
            {translations[lang]?.alreadyHaveAccount || 'Already have an account?'}{' '}
            <Link 
              to="/login" 
              style={{
                color: 'var(--color-primary-700)',
                textDecoration: 'underline',
                fontWeight: 600
              }}
            >
              {translations[lang]?.login || 'Login'}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
