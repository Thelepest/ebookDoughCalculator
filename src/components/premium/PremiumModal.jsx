import React, { useState } from 'react';
import './PremiumModal.css';
import '../../App.css';
import translations from '../../utils/translations';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser } from '../../services/supabaseService';
import { FaWindowClose, FaCrown, FaCheckCircle } from 'react-icons/fa';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

const PayPalSubscriptionButton = ({ tier, onSubscriptionComplete }) => {
    const { user } = useAuth();
    // Ho aggiunto isRejected e options per il debug
    const [{ options, isPending, isRejected }] = usePayPalScriptReducer();

    // Aggiungo un log per vedere lo stato
    console.log("STATO PAYPAL SDK:", { isPending, isRejected, options });

    // TODO: Replace with your actual Plan IDs from the PayPal Developer Dashboard
    const planIds = {
        top_baker: 'P-9K833157Y28496259NFPIWYQ',
        premium_baker: 'P-3JS198413F231360NNFPIWFA',
    };

    const planId = planIds[tier];

    const createSubscription = (data, actions) => {
        return actions.subscription.create({
            plan_id: planId,
        });
    };

    const onApprove = async (data, actions) => {
        try {
            await updateUser(user.id, {
                subscriptionTier: tier,
                paypalSubscriptionId: data.subscriptionID,
            });
            console.log(`Subscription ${data.subscriptionID} approved! User ${user.id} updated to ${tier}.`);
            onSubscriptionComplete();
        } catch (error) {
            console.error("Failed to update user after subscription approval:", error);
        }
    };

    const onError = (err) => {
        console.error("PayPal subscription error:", err);
    };

    if (isPending) {
        console.log("PayPal SDK è in caricamento (isPending=true)... mostro lo spinner.");
        return <div className="spinner" />;
    }
    
    if (isRejected) {
        console.error("ERRORE: Il caricamento dello script di PayPal è fallito (isRejected=true). Controlla il Client ID.");
        return <p style={{color: 'red', textAlign: 'center'}}>Errore nel caricamento di PayPal. Controlla il Client ID.</p>;
    }

    // Se arriviamo qui, i pulsanti dovrebbero essere renderizzati
    console.log("Provo a renderizzare i pulsanti PayPal.");
    return (
        <div style={{ position: 'relative', zIndex: 10 }}>
            <PayPalButtons
                style={{ layout: 'vertical', label: 'subscribe' }}
                createSubscription={createSubscription}
                onApprove={onApprove}
                onError={onError}
            />
        </div>
    );
};


const PremiumModal = ({ isOpen, onClose, lang }) => {
    
    if (!isOpen) return null;

    const handleSubscriptionComplete = () => {
        onClose();
    };

    return (
        <div className="premium-modal-overlay" onClick={onClose}>
            <div className="premium-modal-content" onClick={e => e.stopPropagation()}>
                <div className="premium-modal-header">
                    <FaCrown className="premium-icon" />
                    <h2>{translations[lang].premiumTitle || 'Go Premium'}</h2>
                    <button className="close-btn-icon" onClick={onClose}><FaWindowClose /></button>
                </div>
                
                <div className="premium-modal-body">
                    <p className="premium-description">
                        {translations[lang].premiumDescription || 'Choose your plan and unlock exclusive features!'}
                    </p>
                    
                    <div className="premium-tiers">
                        {/* Top Baker Tier */}
                        <div className="tier-card">
                            <h3>Top Baker</h3>
                            <div className="price">€69<span>/year</span></div>
                            <ul className="features-list">
                                <li><FaCheckCircle /> {translations[lang].premiumFeature1 || 'Premium Recipes'}</li>
                                <li><FaCheckCircle /> {translations[lang].whatsappSupport || 'WhatsApp Support'}</li>
                            </ul>
                            <PayPalSubscriptionButton tier="top_baker" onSubscriptionComplete={handleSubscriptionComplete} />
                        </div>

                        {/* Premium Baker Tier */}
                        <div className="tier-card recommended">
                            <span className="recommended-badge">Recommended</span>
                            <h3>Premium Baker</h3>
                            <div className="price">€99<span>/year</span></div>
                            <ul className="features-list">
                                <li><FaCheckCircle /> {translations[lang].premiumFeature1 || 'Premium Recipes'}</li>
                                <li><FaCheckCircle /> {translations[lang].whatsappSupport || 'WhatsApp Support'}</li>
                                <li><FaCheckCircle /> {translations[lang].videoRecipes || 'Video Recipes'}</li>
                            </ul>
                            <a href="/video-recipe-preview" target="_blank" rel="noopener noreferrer" className="video-link">
                                {translations[lang].videoPreview || 'Want to know more? Try this recipe!'}
                            </a>
                            <PayPalSubscriptionButton tier="premium_baker" onSubscriptionComplete={handleSubscriptionComplete} />
                        </div>
                    </div>
                    
                    <p className="renewal-info">
                        {translations[lang].renewalInfo || 'Your subscription will automatically renew every year. You can cancel anytime from your PayPal account.'}
                    </p>
                </div>

                <div className="premium-modal-buttons">
                    <button 
                        className="premium-close-btn pages-button"
                        onClick={onClose}
                    >
                        <FaWindowClose style={{ marginRight: '8px' }} />
                        {translations[lang].close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
