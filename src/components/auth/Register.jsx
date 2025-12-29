import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import translations from '../../utils/translations';
import '../../App.css';

const Register = ({ lang }) => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <h2 className="section-title">{translations[lang].register || 'Register'}</h2>
      <form onSubmit={handleSubmit} className="content">
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <div style={{color:'red'}}>{error}</div>}
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="pages-button" type="submit">{translations[lang].register || 'Register'}</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
