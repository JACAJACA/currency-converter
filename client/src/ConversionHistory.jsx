import React, { useState, useEffect } from 'react';
import api from './axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './ConversionHistory.css'

const ConversionHistory = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);

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
            if (api.defaults.headers && api.defaults.headers.common) {
              delete api.defaults.headers.common['Authorization'];
            }
          };
          
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchConversionHistory();
        }
    }, [isAuthenticated, user]);

    const fetchConversionHistory = async () => {
        try {
            const response = await api.get('/api/conversion-history');
            setHistory(response.data);
        } catch (error) {
            console.error('Error while downloading history:', error);
        }
    };

    return (
        <div className="conversion-history">
            <h2>Conversion History</h2>
            {history.length > 0 ? (
                <ul>
                    {history.map((entry, index) => (
                        <li key={index}>
                            <p>From: {entry.fromCurrency}, To: {entry.toCurrency}</p>
                            <p>Amount: {entry.amount} {entry.fromCurrency}, Converted: {entry.convertedAmount} {entry.toCurrency}</p>
                            <p>Rate: {entry.conversionRate}</p>
                            <p>Date: {new Date(entry.conversionDate).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No conversion history available.</p>
            )}
        </div>
    );
};

export default ConversionHistory;