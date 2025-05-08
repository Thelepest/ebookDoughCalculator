import React, { useState, useEffect } from "react";
import { getUserLanguage } from "./utils/utils";
import translations from "./utils/translations";
import Calculator from "./components/calculator/Calculator";
import "./App.css";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import Sourdough from "./components/sourdough/Sourdough";
import saccaroico from "./assets/saccaro_ok.ico"

function App() {
    const [lang, setLang] = useState("PL");

    useEffect(() => {
        async function fetchLanguage() {
            const countryCode = await getUserLanguage();
            setLang(translations[countryCode] ? countryCode : "EN");
        }
        fetchLanguage();
    }, []);

    return (
        <BrowserRouter>
            <div className="container">
                <header>
                    <div className="title-with-icon">
                        <img src={saccaroico} alt="logo" className="header-icon" />
                        <h2>{translations[lang].title}</h2>
                    </div>
                    <h3>{translations[lang].subTitle}</h3>
                </header>
                <nav className="homepage-button">
                    <Link to="/calculator">
                        <button>{translations[lang].calculatorButton}</button>
                    </Link>
                    <Link to="/sourdough">
                        <button>{translations[lang].createSourdough}</button>
                    </Link>
                    <Link to="/settings">
                        <button>{translations[lang].sets}</button>
                    </Link>
                </nav>
                <main>
                    <Routes>
                        <Route path="/calculator" element={<Calculator lang={lang} />} />
                        <Route path="/sourdough" element={<Sourdough lang={lang} />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
