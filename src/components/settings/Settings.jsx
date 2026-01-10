import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { updateUser } from '../../services/firestoreService';
import translations from "../../utils/translations";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaWindowClose, FaTrash, FaUserCircle, FaCrown } from "react-icons/fa";
import PremiumModal from '../premium/PremiumModal';
import "./Settings.css";
import "../../App.css";
import "../recipe-modal/Modal.css";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, lang, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 style={{ color: 'var(--color-accent-dark)', marginBottom: '16px' }}>
                    {translations[lang]?.deleteAccount?.title || 'Delete Account'}
                </h2>
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ marginBottom: '12px', fontSize: '1rem', lineHeight: '1.5' }}>
                        {translations[lang]?.deleteAccount?.message || 'Are you sure you want to delete your account?'}
                    </p>
                    <p style={{ 
                        color: 'var(--color-accent-dark)', 
                        fontWeight: 'bold', 
                        fontSize: '0.95rem',
                        marginTop: '12px'
                    }}>
                        ⚠️ {translations[lang]?.deleteAccount?.warning || 'Warning: This action cannot be undone!'}
                    </p>
                </div>
                <div className="modal-buttons-group">
                    <button 
                        className="modal-button modal-close-btn" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        <FaWindowClose style={{ marginRight: "8px" }} />
                        {translations[lang]?.deleteAccount?.cancel || 'Cancel'}
                    </button>
                    <button 
                        className="modal-button" 
                        onClick={onConfirm}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                            color: 'white'
                        }}
                    >
                        <FaTrash style={{ marginRight: "8px" }} />
                        {loading 
                            ? (translations[lang]?.deleteAccount?.deleting || 'Deleting...')
                            : (translations[lang]?.deleteAccount?.confirm || 'Yes, Delete Account')
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

const CancelSubscriptionModal = ({ isOpen, onClose, onConfirm, lang, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2 style={{ color: 'var(--color-accent-dark)', marginBottom: '16px' }}>
                    {translations[lang]?.cancelSubscription?.title || 'Cancel Subscription'}
                </h2>
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ marginBottom: '12px', fontSize: '1rem', lineHeight: '1.5' }}>
                        {translations[lang]?.cancelSubscription?.message || 'Are you sure you want to cancel your subscription? You will lose access to premium features.'}
                    </p>
                </div>
                <div className="modal-buttons-group">
                    <button 
                        className="modal-button modal-close-btn" 
                        onClick={onClose}
                        disabled={loading}
                    >
                        {translations[lang]?.cancelSubscription?.cancel || 'Go Back'}
                    </button>
                    <button 
                        className="modal-button" 
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading
                            ? (translations[lang]?.cancelSubscription?.cancelling || 'Cancelling...')
                            : (translations[lang]?.cancelSubscription?.confirm || 'Yes, Cancel')
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

const Settings = ({ lang, setLang }) => {
    const navigate = useNavigate();
    const { user, subscriptionTier, logout, deleteAccount } = useAuth();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const subscriptionTierName = {
        free: 'Free User',
        top_baker: 'Top Baker',
        premium_baker: 'Premium Baker',
    };

    const handleChangeLang = (e) => {
        const newLang = e.target.value;
        setLang(newLang);
        localStorage.setItem("appLang", newLang);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteAccount();
            navigate('/login');
        } catch (err) {
            console.error('Delete account failed', err);
            setDeleteError(translations[lang]?.deleteAccount?.error || 'An error occurred while deleting the account.');
            setIsDeleting(false);
        }
    };

    const handleCancelSubscription = async () => {
        setIsCancelling(true);
        try {
            await updateUser(user.uid, { subscriptionTier: 'free' });
            setShowCancelSubscriptionModal(false);
        } catch (error) {
            console.error('Failed to cancel subscription', error);
        } finally {
            setIsCancelling(false);
        }
    };

    const handleInstagram = () => {
        const username = 'marcobiasone_masterchef_x';
        const appLink = `instagram://user?username=${username}`;
        const webLink = `https://www.instagram.com/${username}/`;

        window.location.href = appLink;
        setTimeout(() => {
            window.open(webLink, '_blank');
        }, 700);
    };

    const handleWhatsapp = () => {
        const phone = '3487899305';
        const encodedMsg = encodeURIComponent(translations[lang].contactMessageCalculator || '');
        const appLink = `whatsapp://send?phone=${phone}&text=${encodedMsg}`;
        const webLink = `https://wa.me/${phone}?text=${encodedMsg}`;

        window.location.href = appLink;
        setTimeout(() => {
            window.open(webLink, '_blank');
        }, 700);
    };

    const handleEmail = () => {
        const to = 'marco.biasone.90@gmail.com';
        const subject = encodeURIComponent('PH4.1 App - ' + translations[lang].contactTitle);
        const body = encodeURIComponent(translations[lang].contactMessageCalculator || '');
        const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;

        window.location.href = mailtoLink;
        setTimeout(() => {
            window.open(gmailLink, '_blank');
        }, 700);
    };

    return (
        <div className="page-container">
            <h2 className="section-title">{translations[lang].sectionTitles?.settings || translations[lang].sets}</h2>

            <div className="info-section user-profile">
                <h3><FaUserCircle style={{ marginRight: '8px' }} />User Profile</h3>
                <div className="user-info">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="profile-pic" />
                    ) : (
                        <FaUserCircle size={50} className="profile-pic-default" />
                    )}
                    <div className="user-details">
                        <p>{user?.email}</p>
                        <p className="subscription-status">
                            <FaCrown style={{ marginRight: '5px', color: 'var(--color-accent)' }} />
                            {subscriptionTierName[subscriptionTier]}
                        </p>
                    </div>
                </div>
                {subscriptionTier === 'free' ? (
                    <button onClick={() => setShowPremiumModal(true)} className="pages-button">
                        {translations[lang]?.upgradeToPremium || 'Go to Premium'}
                    </button>
                ) : (
                    <button onClick={() => setShowCancelSubscriptionModal(true)} className="pages-button">
                        {translations[lang]?.cancelSubscription?.title || 'Cancel Subscription'}
                    </button>
                )}
            </div>

            <label htmlFor="language">🌐 Select Language:</label>
            <select id="language" value={lang} onChange={handleChangeLang}>
                <option value="EN">English</option>
                <option value="PL">Polski</option>
                <option value="IT">Italiano</option>
            </select>

            <div className="info-section">
                <h3>📞 Contacts</h3>
                <div className="contacts-icons">
                    <button
                        type="button"
                        onClick={handleInstagram}
                        className="contact-icon"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={34} />
                    </button>
                    {(subscriptionTier === 'premium_baker' || subscriptionTier === 'top_baker') && (
                        <button
                            type="button"
                            onClick={handleWhatsapp}
                            className="contact-icon"
                            aria-label="WhatsApp"
                        >
                            <FaWhatsapp size={34} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleEmail}
                        className="contact-icon"
                        aria-label="Email"
                    >
                        <FaEnvelope size={34} />
                    </button>
                </div>
            </div>

            <div className="info-section">
                <p>🔢 Version: 2.0.1</p>
                <p>© 2025 Marco Biasone - All rights reserved.</p>
            </div>
            <div className="button-group centered-buttons">
                <button type="button" onClick={() => navigate('/')} className="home-btn pages-button">
                    <FaWindowClose style={{ marginRight: '8px',verticalAlign: 'middle' }} />
                    {translations[lang].goBack}
                </button>
                <button type="button" onClick={handleLogout} className="pages-button">
                    Logout
                </button>
                <button 
                    type="button" 
                    onClick={() => setShowDeleteModal(true)} 
                    className="pages-button"
                    style={{
                        background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)'
                    }}
                >
                    <FaTrash style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    {translations[lang]?.deleteAccount?.title || 'Delete Account'}
                </button>
            </div>

            {deleteError && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#ffebee',
                    borderRadius: '4px',
                    border: '1px solid #ffcdd2',
                    color: 'var(--color-accent-dark)',
                    fontSize: '0.9rem'
                }}>
                    {deleteError}
                </div>
            )}

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeleteError(null);
                }}
                onConfirm={handleDeleteAccount}
                lang={lang}
                loading={isDeleting}
            />

            <CancelSubscriptionModal
                isOpen={showCancelSubscriptionModal}
                onClose={() => setShowCancelSubscriptionModal(false)}
                onConfirm={handleCancelSubscription}
                lang={lang}
                loading={isCancelling}
            />

            {showPremiumModal && (
                <PremiumModal
                    isOpen={showPremiumModal}
                    onClose={() => setShowPremiumModal(false)}
                    lang={lang}
                />
            )}
        </div>
    );
};

export default Settings;
