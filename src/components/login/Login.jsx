// src/components/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FaGoogle, FaEnvelope } from "react-icons/fa";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Errore login Google:", err);
            setError("Impossibile accedere con Google");
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Errore login Email:", err);
            setError("Email o password non validi");
        }
    };

    return (
        <div className="login-page">
            <h2>Welcome to Sourdough App</h2>
            {error && <div className="error">{error}</div>}

            {/* Google Login */}
            <button onClick={handleGoogleLogin} className="google-btn">
                <FaGoogle style={{ marginRight: 8 }} />
                Login with Google
            </button>

            {/* Divider */}
            <div className="divider">OR</div>

            {/* Email / Password Login */}
            <form onSubmit={handleEmailLogin} className="email-form">
                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <FaEnvelope className="input-icon" style={{ transform: "rotate(90deg)" }} />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="email-btn">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
