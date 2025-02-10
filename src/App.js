import React, { useState, useEffect } from "react";
import { getUserLanguage } from "./utils";
import translations from "./translations";
import Calculator from "./Calculator";
import "./App.css";

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
        <div className="calculator-container">
            <header>
                <h2>{translations[lang].title}</h2>
            </header>
            <main>
                <Calculator lang={lang} />
            </main>
        </div>
    );
}

export default App;
