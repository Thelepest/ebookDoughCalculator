import React, {useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {auth} from "./firebase";
import {onAuthStateChanged} from "firebase/auth";
import {getUserLanguage} from "./utils/utils";
import translations from "./utils/translations";

import Login from "./components/login/Login";
import MainContent from "./components/maincontent/MainContent";

import "./App.css";

function App() {
    const [lang, setLang] = useState("PL");
    const [authenticated, setAuthenticated] = useState(false);

    // 1) Init lingua
    useEffect(() => {
        (async () => {
            const countryCode = await getUserLanguage();
            const stored = localStorage.getItem("appLang");
            const code = stored || (translations[countryCode] ? countryCode : "EN");
            setLang(code);
        })();
    }, []);

    // 2) Listener Firebase Auth per persistenza login
    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setAuthenticated(!!user);
        });
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Pubblica solo login */}
                <Route
                    path="/login"
                    element={
                        authenticated
                            ? <Navigate to="/" replace />
                            : <Login />
                    }
                />

                {/* Tutte le altre rotte vanno al MainContent se autenticato */}
                <Route
                    path="/*"
                    element={
                        authenticated
                            ? <MainContent lang={lang} setLang={setLang} />
                            : <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
