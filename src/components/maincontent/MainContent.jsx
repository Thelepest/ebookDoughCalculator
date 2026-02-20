import React from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Spinner from "../spinner/Spinner";
import PageTransition from "../navigation/PageTransition";
import Calculator from "../calculator/Calculator";
import Sourdough from "../sourdough/Sourdough";
import Settings from "../settings/Settings";
import NotesPage from "../notes/NotesPage";
import CalendarPage from "../calendar/CalendarPage";
import AdminChat from "../messages/AdminChat";
import Login from "../auth/Login";
import RecipesPage from "../recipes/RecipesPage";
import RecipeDetailPage from "../recipes/RecipeDetailPage";
import translations from "../../utils/translations";
import Header from "../header/Header";
import NetworkAlert from "../network/NetworkAlert";
import allproducts from "../../assets/allproducts.jpg";
import "../../App.css";
import PrivacyPolicy from "../privacy/PrivacyPolicy";

const Home = ({ lang }) => (
    <div className="container">
        <Header lang={lang} />

        <nav className="homepage-button">
            <Link to="/sourdough">
                <button>{translations[lang].createSourdough}</button>
            </Link>
            <Link to="/calculator">
                <button>{translations[lang].calculatorButton}</button>
            </Link>
            <Link to="/recipes">
                <button>{translations[lang].recipesButton || 'Ricette'}</button>
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

const DefaultRoute = ({ lang }) => {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to="/" replace />;
};

const MainContent = ({ lang, setLang }) => {
    const { user, loading, needsPrivacyAcceptance, setNeedsPrivacyAcceptance } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <Spinner />;
    }

    if (user && needsPrivacyAcceptance) {
        return (
            <PrivacyPolicy
                lang={lang}
                onAccept={() => {
                    setNeedsPrivacyAcceptance(false);
                    navigate('/');
                }}
            />
        );
    }

    return (
        <>
            <NetworkAlert lang={lang} />
            <PageTransition />
            <Routes>
            <Route path="/login" element={<Login lang={lang} />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />

            <Route path="/" element={<RequireAuth><Home lang={lang} /></RequireAuth>} />
            <Route path="/calculator" element={<RequireAuth><Calculator lang={lang} /></RequireAuth>} />
            <Route path="/sourdough" element={<RequireAuth><Sourdough lang={lang} /></RequireAuth>} />
            <Route path="/recipes" element={<RequireAuth><RecipesPage lang={lang} /></RequireAuth>} />
            <Route path="/recipes/:recipeId" element={<RequireAuth><RecipeDetailPage lang={lang} /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings lang={lang} setLang={setLang} /></RequireAuth>} />
            <Route path="/notes" element={<RequireAuth><NotesPage lang={lang} /></RequireAuth>} />
            <Route path="/calendar" element={<RequireAuth><CalendarPage lang={lang} /></RequireAuth>} />
            <Route path="/messages" element={<RequireAuth><AdminChat lang={lang} /></RequireAuth>} />

            <Route path="*" element={<DefaultRoute lang={lang} />} />
        </Routes>
        </>
    );
};

export default MainContent;
