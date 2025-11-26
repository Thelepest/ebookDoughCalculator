import React from "react";
import { useNavigate } from "react-router-dom";
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

    // logout removed as per request (only back button kept)

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
                    <a
                        href="https://www.instagram.com/marcobiasone_masterchef_x/"
                        target="_blank"
                        rel="noreferrer"
                        className="contact-icon"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={34} />
                    </a>
                    <a
                        href="https://wa.me/3487899305"
                        target="_blank"
                        rel="noreferrer"
                        className="contact-icon"
                        aria-label="WhatsApp"
                    >
                        <FaWhatsapp size={34} />
                    </a>
                    <a
                        href="mailto:marco.biasone.90@gmail.com"
                        className="contact-icon"
                        aria-label="Email"
                    >
                        <FaEnvelope size={34} />
                    </a>
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
            </div>
        </div>
    );
};

export default Settings;
