import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import translations from "../../utils/translations";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaWindowClose } from "react-icons/fa";
import "./Settings.css";
import "../../App.css";

const Settings = ({ lang, setLang }) => {
    const navigate = useNavigate();

    const handleChangeLang = (e) => {
        const newLang = e.target.value;
        setLang(newLang);
        localStorage.setItem("appLang", newLang);
    };

    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
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
                    <button
                        type="button"
                        onClick={handleWhatsapp}
                        className="contact-icon"
                        aria-label="WhatsApp"
                    >
                        <FaWhatsapp size={34} />
                    </button>
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
            </div>
        </div>
    );
};

export default Settings;
