import React, { useState, useEffect } from "react";
import { FaInstagram, FaWhatsapp, FaEnvelope, FaWindowClose } from "react-icons/fa";
import translations from "../../utils/translations";
import "./ContactModal.css";

const ContactModal = ({ isOpen, onClose, message, lang }) => {
    const [editableMessage, setEditableMessage] = useState(message || "");

    useEffect(() => {
        // Reset editable message when modal opens or message prop changes
        if (isOpen) setEditableMessage(message || "");
    }, [isOpen, message]);

    if (!isOpen) return null;

    const handleInstagram = () => {
        // Try opening the Instagram app via deep link, fallback to web profile
        const username = 'marcobiasone_masterchef_x';
        const appLink = `instagram://user?username=${username}`;
        const webLink = `https://www.instagram.com/${username}/`;

        // Attempt to open app
        window.location.href = appLink;

        // Fallback: if app didn't open, open web profile after short delay
        setTimeout(() => {
            window.open(webLink, '_blank');
        }, 700);
    };

    const handleWhatsapp = () => {
        // Try opening WhatsApp app via deep link, fallback to web wa.me
        const phone = '3487899305';
        const encodedMsg = encodeURIComponent(editableMessage);
        const appLink = `whatsapp://send?phone=${phone}&text=${encodedMsg}`;
        const webLink = `https://wa.me/${phone}?text=${encodedMsg}`;

        // Attempt to open app
        window.location.href = appLink;

        // Fallback to web link if app doesn't open
        setTimeout(() => {
            window.open(webLink, '_blank');
        }, 700);
    };

    const handleEmail = () => {
        // Try opening default mail app via mailto, fallback to Gmail web compose
        const to = 'marco.biasone.90@gmail.com';
        const subject = encodeURIComponent("PH4.1 App - " + translations[lang].contactTitle);
        const body = encodeURIComponent(editableMessage);
        const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;

        // Attempt to open mail client
        window.location.href = mailtoLink;

        // Fallback to Gmail compose in new tab
        setTimeout(() => {
            window.open(gmailLink, '_blank');
        }, 700);
    };

    return (
        <div className="modal-overlay-contact">
            <div className="modal-content-contact">
                <button className="modal-back-btn" onClick={onClose}>
                    <FaWindowClose style={{ marginRight: "8px", verticalAlign: "middle" }} />
                    {translations[lang].goBack}
                </button>

                <h2>{translations[lang].contactTitle}</h2>

                <textarea
                    className="contact-textarea"
                    value={editableMessage}
                    onChange={(e) => setEditableMessage(e.target.value)}
                    aria-label={translations[lang].contactTitle}
                />

                <div className="contacts-icons-modal">
                    <button
                        className="contact-icon-btn"
                        onClick={handleInstagram}
                        aria-label="Instagram"
                    >
                        <FaInstagram size={40} className="icon-instagram" />
                        <span>Instagram</span>
                    </button>

                    <button
                        className="contact-icon-btn"
                        onClick={handleWhatsapp}
                        aria-label="WhatsApp"
                    >
                        <FaWhatsapp size={40} className="icon-whatsapp" />
                        <span>WhatsApp</span>
                    </button>

                    <button
                        className="contact-icon-btn"
                        onClick={handleEmail}
                        aria-label="Email"
                    >
                        <FaEnvelope size={40} className="icon-email" />
                        <span>Email</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
