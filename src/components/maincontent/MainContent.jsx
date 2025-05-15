import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import Calculator from "../calculator/Calculator";
import Sourdough from "../sourdough/Sourdough";
import Settings from "../settings/Settings";
import translations from "../../utils/translations";
import saccaroico from "../../assets/saccaro_ok.ico";
import "../../App.css";

interface Props {
    lang: string;
    setLang: (code: string) => void;
}

const MainContent: React.FC<Props> = ({ lang, setLang }) => (
    <div className="container">
        <header>
            <div className="title-with-icon">
                <img src={saccaroico} alt="logo" className="header-icon" />
                <h2>{translations[lang].title}</h2>
            </div>
            <h3>{translations[lang].subTitle}</h3>
        </header>

        <nav className="homepage-button">
            <Link to="/sourdough">
                <button>{translations[lang].createSourdough}</button>
            </Link>
            <Link to="/calculator">
                <button>{translations[lang].calculatorButton}</button>
            </Link>
            <Link to="/settings">
                <button>{translations[lang].sets}</button>
            </Link>
        </nav>

        <main>
            <Routes>
                <Route path="/" element={<Navigate to="/calculator" replace />} />
                <Route path="/calculator" element={<Calculator lang={lang} />} />
                <Route path="/sourdough" element={<Sourdough lang={lang} />} />
                <Route
                    path="/settings"
                    element={<Settings lang={lang} setLang={setLang} />}
                />
                {/* catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
    </div>
);

export default MainContent;
