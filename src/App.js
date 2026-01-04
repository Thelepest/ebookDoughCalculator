import React, {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {getUserLanguage} from "./utils/utils";
import translations from "./utils/translations";
import { NetworkErrorProvider } from "./contexts/NetworkErrorContext";

import MainContent from "./components/maincontent/MainContent";

import "./App.css";

function AppContent({ lang, setLang }) {
    return (
        <Routes>
            <Route path="/*" element={<MainContent lang={lang} setLang={setLang} />} />
        </Routes>
    );
}

function App() {
    const [lang, setLang] = useState("PL");

    // Init lingua
    useEffect(() => {
        (async () => {
            const countryCode = await getUserLanguage();
            const stored = localStorage.getItem("appLang");
            const code = stored || (translations[countryCode] ? countryCode : "EN");
            setLang(code);
        })();
    }, []);

    return (
        <BrowserRouter>
            <NetworkErrorProvider>
                <AppContent lang={lang} setLang={setLang} />
            </NetworkErrorProvider>
        </BrowserRouter>
    );
}

export default App;
