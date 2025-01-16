import React, { useState, useEffect } from "react";
import api from "./axiosConfig";
import "./Home.css";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ from: "", to: "", amount: "" });
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const currencyCodes = ["USD", "EUR", "GBP", "GHS", "JPY", "CAD"];

    useEffect(() => {
        console.log('Home useEffect - isAuthenticated:', isAuthenticated);
        const checkAuth = setTimeout(() => {
            if (!isAuthenticated) {
                console.log('Not authenticated, redirecting to login');
                navigate('/login');
            }
        }, 100);

        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }

        return () => {
            clearTimeout(checkAuth);
            delete api.defaults.headers.common['Authorization'];
        };
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Najpierw próbujemy wykonać zapytanie do /api/convert
            const response = await api.post("/api/convert", formData);
            setResult(response.data);
            setError("");
        } catch (error) {
            // Jeśli otrzymamy błąd 401 (wygasły token), wykonujemy zapytanie do /api/refresh-token
            if (error.response && error.response.status === 401) {
                try {
                    // Próba odświeżenia tokenu
                    const refreshResponse = await api.post("/api/refresh-token", { token: localStorage.getItem("token") });
                    // Zapisujemy nowy token w localStorage
                    localStorage.setItem("token", refreshResponse.data.token);
                    // Ponownie próbujemy wykonać zapytanie do /api/convert
                    const retryResponse = await api.post("/api/convert", formData);
                    setResult(retryResponse.data);
                    setError("");
                } catch (refreshError) {
                    // Jeśli odświeżenie tokenu się nie powiedzie, wylogowujemy użytkownika
                    setError("Token refresh failed. Please log in again.");
                    logout();
                    navigate("/login");
                }
            } else {
                setError(error.response?.data?.message || error.message);
            }
        }
    };
    

    const handleViewHistory = () => {
        navigate("/history");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="home-container">
            <h1 className="title">Currency Converter</h1>
            <div className="user-info">
                <p>Welcome, <strong>{user?.name}</strong></p>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
            <form onSubmit={handleSubmit} className="currency-form">
                <div className="form-group">
                    <label htmlFor="from">From Currency</label>
                    <select 
                        className="form-control" 
                        id="from" 
                        name="from" 
                        value={formData.from} 
                        onChange={handleChange}
                    >
                        <option value="">Select From Currency</option>
                        {currencyCodes.map(code => (
                            <option key={code} value={code}>{code}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="to">To Currency</label>
                    <select 
                        className="form-control" 
                        id="to" 
                        name="to" 
                        value={formData.to} 
                        onChange={handleChange}
                    >
                        <option value="">Select To Currency</option>
                        {currencyCodes.map(code => (
                            <option key={code} value={code}>{code}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        id="amount" 
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange}
                        placeholder="Enter Amount"
                    />
                </div>
                <button type="submit" className="btn-submit">Convert</button>
            </form>
            {result && (
                <div className="result">
                    <p>Converted Amount: {result.conversionAmount} {result.target}</p>
                    <p>Conversion Rate: {result.conversionRate}</p>
                </div>
            )}
            {error && <div className="error" data-testid='error-message'>{error}</div>}

            <button onClick={handleViewHistory} className="btn-history">
                View Conversion History
            </button>
        </div>
    );
};

export default Home;
