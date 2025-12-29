import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import translations from '../../utils/translations';
import '../../App.css';
import { FaGoogle } from 'react-icons/fa';

const Login = ({ lang }) => {
  const { login, signup, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showRegisterSuggestion, setShowRegisterSuggestion] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(translations[lang]?.authErrors?.['empty-fields'] || 'Please enter email and password.');
      return;
    }

    try {
      await login(email, password);
      setShowRegisterSuggestion(false);
      navigate('/');
    } catch (err) {
      let code = err?.code || '';
      if (!code && err?.message) {
        const m = err.message.match(/\((auth\/[^)]+)\)/);
        if (m && m[1]) code = m[1];
      }
      const mapped = translations[lang]?.authErrors?.[code];
      setError(mapped || err.message || 'Login failed');
      if (code === 'auth/user-not-found') setShowRegisterSuggestion(true);
      else setShowRegisterSuggestion(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      setError(translations[lang]?.authErrors?.['empty-fields'] || 'Please enter email and password.');
      return;
    }
    try {
      await signup(email, password);
      setShowRegisterSuggestion(false);
      navigate('/');
    } catch (err) {
      let code = err?.code || '';
      if (!code && err?.message) {
        const m = err.message.match(/\((auth\/[^)]+)\)/);
        if (m && m[1]) code = m[1];
      }
      const mapped = translations[lang]?.authErrors?.[code];
      setError(mapped || err.message || 'Registration failed');
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="page-container login-center">
      <h2 className="section-title">{translations[lang].login || 'Login'}</h2>
      <form onSubmit={handleSubmit} className="content">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
        <div className="login-button-row">
          <button className="pages-button" type="submit" disabled={!email || !password}>{translations[lang].login || 'Login'}</button>

          <button type="button" className="pages-button social google" onClick={handleGoogle} aria-label="Sign in with Google">
            <FaGoogle style={{marginRight:8,verticalAlign:'middle'}} /> Google
          </button>
        </div>
        {showRegisterSuggestion && (
          <div style={{marginTop:12}}>
            <p style={{margin:0}}>No account found for this email. Would you like to register?</p>
            <div style={{marginTop:8}}>
              <button type="button" className="pages-button" onClick={handleRegister}>Register</button>
            </div>
          </div>
        )}
      </form>
      
    </div>
  );
};

export default Login;
