import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        amount: ''
    });

    useEffect(() => {
        console.log('Home useEffect - isAuthenticated:', isAuthenticated);
        const checkAuth = setTimeout(() => {
            if (!isAuthenticated) {
                console.log('Not authenticated, redirecting to login');
                navigate('/login');
            }
        }, 100);

        return () => clearTimeout(checkAuth);
    }, [isAuthenticated, user, navigate]);

    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const currencyCodes = ['USD', 'EUR', 'GBP', 'GHS', 'JPY', 'CAD'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/convert",
                formData
            );
            console.log(response)
            setResult(response?.data)
            setError("")
        } catch (error) {
            setError(
                "Error",
                error?.response ? error?.response?.data : error?.message
            )
        }
    };

    const handleViewHistory = () => {
        navigate('/history');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="home-container">
            <h1 className="title">Currency Converter</h1>
            <div className="user-info">
                <p>Welcome, <strong>{user?.name || 'User'}</strong></p>
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
                    <p>
                        Converted Amount: <span>{result.conversionAmount} {result.target}</span>
                    </p>
                    <p>
                        Conversion Rate: <span>{result.conversionRate}</span>
                    </p>
                </div>
            )}
            {error && <div className="error">{error}</div>}

            <button 
                onClick={handleViewHistory} 
                className="btn-history"
            >
                View Conversion History
            </button>
        </div>
    );
}

export default Home;