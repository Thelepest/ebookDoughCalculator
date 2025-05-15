import React from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../../firebase";
import "./Login.css";
import "../../App.css";


const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/", { replace: true });
        } catch (err) {
            console.error("Errore login:", err);
        }
    };

    return (
        <div className="login-page">
            <h2>Welcome to Sourdough App</h2>
            <button onClick={handleGoogleLogin} className="google-btn">
                Login with Google
            </button>
        </div>
    );
};

export default Login;
