import React, { useEffect, useState } from 'react';
import { useNetworkError } from '../../contexts/NetworkErrorContext';
import translations from '../../utils/translations';
import './NetworkAlert.css';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const NetworkAlert = ({ lang }) => {
    const { networkError, clearError } = useNetworkError();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (networkError) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [networkError]);

    if (!networkError || !isVisible) return null;

    return (
        <div className={`network-alert ${isVisible ? 'network-alert-visible' : ''}`}>
            <div className="network-alert-content">
                <FaExclamationTriangle className="network-alert-icon" />
                <span className="network-alert-message">
                    {translations[lang]?.networkError || 'Problema di connessione. Controlla la tua rete e riprova.'}
                </span>
                <button 
                    className="network-alert-close"
                    onClick={clearError}
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default NetworkAlert;



