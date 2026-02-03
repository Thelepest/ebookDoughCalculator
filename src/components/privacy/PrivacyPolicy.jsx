import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import translations from '../../utils/translations';
import Header from '../header/Header';
import '../../App.css';

const PrivacyPolicy = ({ lang, onAccept }) => {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAccept = async () => {
    if (acceptedPrivacy && acceptedTerms && user) {
      setSaving(true);
      setSaveError(null);
      try {
        // Save acceptance data to localStorage
        localStorage.setItem(`privacy_accepted_${user.id}`, 'true');
        localStorage.setItem(`terms_accepted_${user.id}`, 'true');
        localStorage.setItem(`privacy_accepted_date_${user.id}`, new Date().toISOString());
        localStorage.setItem(`privacy_version_${user.id}`, '1.0');

        const { error: acceptanceError } = await supabase
          .from('legal_acceptances')
          .insert({
            user_id: user.id,
            privacy_accepted: true,
            terms_accepted: true,
            privacy_version: '1.0',
            terms_version: '1.0',
            user_email: user.email,
          });

        if (acceptanceError) {
          console.error('Error saving legal acceptance:', acceptanceError);
          setSaveError(translations[lang]?.privacyPolicy?.saveError || 'Failed to save your acceptance. Please try again.');
        }

        if (onAccept) {
          onAccept();
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error saving privacy acceptance:', error);
        setSaveError(translations[lang]?.privacyPolicy?.saveError || 'Failed to save your acceptance. Please try again.');
      } finally {
        setSaving(false);
      }
    }
  };

  const allAccepted = acceptedPrivacy && acceptedTerms;

  return (
    <div className="page-container login-center">
      <div className="container">
        <Header lang={lang} />
      </div>
      <h2 className="section-title">{translations[lang]?.privacyPolicy?.title || 'Privacy Policy & Terms of Service'}</h2>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
          <h3 style={{ fontSize: '1.2rem', marginTop: '0', marginBottom: '12px' }}>
            {translations[lang]?.privacyPolicy?.privacyTitle || 'Privacy Policy'}
          </h3>
          <p style={{ marginBottom: '16px' }}>
            {translations[lang]?.privacyPolicy?.privacyText ||
              'We collect and process your personal data (email address, authentication data) to provide you with our services. Your data is stored securely using Supabase Authentication and Database. We do not share your personal information with third parties without your consent.'}
          </p>
          
          <h3 style={{ fontSize: '1.2rem', marginTop: '24px', marginBottom: '12px' }}>
            {translations[lang]?.privacyPolicy?.dataRightsTitle || 'Your Rights'}
          </h3>
          <p style={{ marginBottom: '16px' }}>
            {translations[lang]?.privacyPolicy?.dataRightsText || 
              'You have the right to access, modify, or delete your personal data at any time through the app settings. You can also request a copy of your data or withdraw your consent at any time.'}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '24px', marginBottom: '12px' }}>
            {translations[lang]?.privacyPolicy?.termsTitle || 'Terms of Service'}
          </h3>
          <p style={{ marginBottom: '16px' }}>
            {translations[lang]?.privacyPolicy?.termsText || 
              'By using this app, you agree to use it responsibly and in accordance with applicable laws. The app is provided "as is" without warranties. We reserve the right to modify these terms at any time.'}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '24px', marginBottom: '12px' }}>
            {translations[lang]?.privacyPolicy?.legalBasisTitle || 'Legal Basis & Data Processing'}
          </h3>
          <p style={{ marginBottom: '12px', fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
            {translations[lang]?.privacyPolicy?.legalBasis || 
              'Legal basis: User consent (GDPR Art. 6(1)(a))'}
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>{translations[lang]?.privacyPolicy?.dataRetentionTitle || 'Data Retention:'}</strong>{' '}
            {translations[lang]?.privacyPolicy?.dataRetention || 
              'Your data is stored until account deletion or consent withdrawal.'}
          </p>
          <p style={{ marginBottom: '12px' }}>
            <strong>{translations[lang]?.privacyPolicy?.dataTransferTitle || 'Data Transfer:'}</strong>{' '}
            {translations[lang]?.privacyPolicy?.dataTransfer ||
              'Your data may be processed outside the EU (Supabase - USA) with adequate safeguards.'}
          </p>

          <h3 style={{ fontSize: '1.2rem', marginTop: '24px', marginBottom: '12px' }}>
            {translations[lang]?.privacyPolicy?.contactTitle || 'Contact'}
          </h3>
          <p style={{ marginBottom: '12px' }}>
            {translations[lang]?.privacyPolicy?.contactText || 
              'For questions about privacy or data processing, please contact us through the app settings.'}
          </p>
          
          <p style={{ marginBottom: '0', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {translations[lang]?.privacyPolicy?.version || 'Version 1.0 - Last updated: 2025'}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          cursor: 'pointer',
          marginBottom: '16px',
          fontSize: '0.95rem'
        }}>
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            style={{ 
              marginRight: '10px', 
              marginTop: '4px',
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span>
            {translations[lang]?.privacyPolicy?.acceptPrivacy || 
              'I have read and accept the Privacy Policy'}
          </span>
        </label>

        <label style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          cursor: 'pointer',
          fontSize: '0.95rem'
        }}>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            style={{ 
              marginRight: '10px', 
              marginTop: '4px',
              width: '18px',
              height: '18px',
              cursor: 'pointer'
            }}
          />
          <span>
            {translations[lang]?.privacyPolicy?.acceptTerms || 
              'I have read and accept the Terms of Service'}
          </span>
        </label>
      </div>

      {saveError && (
        <div style={{
          marginBottom: '12px',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #ffcdd2',
          color: 'var(--color-accent-dark)',
          fontSize: '0.9rem'
        }}>
          {saveError}
        </div>
      )}
      <div className="login-button-row">
        <button 
          className="pages-button" 
          onClick={handleAccept}
          disabled={!allAccepted || saving}
          style={{
            opacity: allAccepted && !saving ? 1 : 0.6,
            cursor: allAccepted && !saving ? 'pointer' : 'not-allowed'
          }}
        >
          {saving 
            ? (translations[lang]?.privacyPolicy?.saving || 'Saving...')
            : (translations[lang]?.privacyPolicy?.continue || 'Continue')
          }
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

