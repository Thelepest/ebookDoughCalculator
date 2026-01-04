import React from 'react';
import './PremiumModal.css';
import '../../App.css';
import translations from '../../utils/translations';
import { FaWindowClose, FaCrown } from 'react-icons/fa';

const PremiumModal = ({ isOpen, onClose, lang }) => {
    if (!isOpen) return null;

    return (
        <div className="premium-modal-overlay" onClick={onClose}>
            <div className="premium-modal-content" onClick={e => e.stopPropagation()}>
                <div className="premium-modal-header">
                    <FaCrown className="premium-icon" />
                    <h2>{translations[lang].premiumTitle || 'Contenuti Premium'}</h2>
                </div>
                
                <div className="premium-modal-body">
                    <p className="premium-description">
                        {translations[lang].premiumDescription || 'Accedi ai contenuti premium per sbloccare ricette esclusive e funzionalità avanzate!'}
                    </p>
                    
                    <div className="premium-features">
                        <h3>{translations[lang].premiumFeatures || 'Cosa include:'}</h3>
                        <ul>
                            <li>{translations[lang].premiumFeature1 || 'Ricette Premium esclusive'}</li>
                            <li>{translations[lang].premiumFeature2 || 'Contenuti avanzati'}</li>
                            <li>{translations[lang].premiumFeature3 || 'Supporto prioritario'}</li>
                        </ul>
                    </div>
                </div>

                <div className="premium-modal-buttons">
                    <button 
                        className="premium-upgrade-btn pages-button"
                        onClick={() => {
                            // Qui puoi aggiungere la logica per l'upgrade
                            // Per ora chiudiamo la modal
                            onClose();
                            // TODO: Aggiungere link a pagina upgrade o integrazione pagamento
                        }}
                    >
                        {translations[lang].upgradeNow || 'Passa a Premium'}
                    </button>
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

