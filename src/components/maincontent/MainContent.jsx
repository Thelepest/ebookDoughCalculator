import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Spinner from "../spinner/Spinner";
import Calculator from "../calculator/Calculator";
import Sourdough from "../sourdough/Sourdough";
import Settings from "../settings/Settings";
import NotesPage from "../notes/NotesPage";
import CalendarPage from "../calendar/CalendarPage";
import AdminChat from "../messages/AdminChat";
import Login from "../auth/Login";
import Register from "../auth/Register";
import translations from "../../utils/translations";
import saccaroico from "../../assets/saccaro_ok.ico";
import allproducts from "../../assets/allproducts.jpg";
import "../../App.css";

const Home = ({ lang }) => (
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
        <div className="head-img-calculator">
            <img src={allproducts} alt="All products" />
        </div>
    </div>
);

const RequireAuth = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const MainContent = ({ lang, setLang }) => (
    <Routes>
        <Route path="/login" element={<Login lang={lang} />} />
        <Route path="/register" element={<Register lang={lang} />} />

        <Route path="/" element={<RequireAuth><Home lang={lang} /></RequireAuth>} />
        <Route path="/calculator" element={<RequireAuth><Calculator lang={lang} /></RequireAuth>} />
        <Route path="/sourdough" element={<RequireAuth><Sourdough lang={lang} /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings lang={lang} setLang={setLang} /></RequireAuth>} />
        <Route path="/notes" element={<RequireAuth><NotesPage lang={lang} /></RequireAuth>} />
        <Route path="/calendar" element={<RequireAuth><CalendarPage lang={lang} /></RequireAuth>} />
        <Route path="/messages" element={<RequireAuth><AdminChat lang={lang} /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
);

export default MainContent;
