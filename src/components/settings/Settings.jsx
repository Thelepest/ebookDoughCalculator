import React from "react";
import { logout } from "../../firebase";
import { useNavigate } from "react-router-dom";
import translations from "../../utils/translations";
import "./Settings.css";
import "../../App.css";
interface Props {
    lang: string;
    setLang: (code: string) => void;
}

const Settings: React.FC<Props> = ({ lang, setLang }) => {
    const navigate = useNavigate();

    const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLang(newLang);
        localStorage.setItem("appLang", newLang);
    };

    const handleLogout = async () => {
        await logout();
        localStorage.removeItem("appLang");
        navigate("/login", { replace: true });
    };

    return (
        <div className="page-container">
            <h2>{translations[lang].sets || "Settings"}</h2>

            <label htmlFor="language">🌐 Select Language:</label>
            <select id="language" value={lang} onChange={handleChangeLang}>
                <option value="EN">English</option>
                <option value="PL">Polski</option>
                <option value="IT">Italiano</option>
            </select>

            <div className="info-section">
                <h3>📞 Contacts</h3>
                <p>
                    Instagram:{" "}
                    <a
                        href="https://instagram.com/tuoaccount"
                        target="_blank"
                        rel="noreferrer"
                    >
                        @tuoaccount
                    </a>
                </p>
                <p>
                    WhatsApp:{" "}
                    <a href="https://wa.me/tuonumero" target="_blank" rel="noreferrer">
                        Chat Now
                    </a>
                </p>
            </div>

            <div className="info-section">
                <p>🔢 Version: 1.0.0</p>
                <p>© 2025 YourName - All rights reserved.</p>
            </div>

            <button className="home-btn logout-btn" onClick={handleLogout}>
                🚪 Logout
            </button>
        </div>
    );
};

export default Settings;
