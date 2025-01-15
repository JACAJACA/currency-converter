import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { useAuth } from './AuthContext';
import './ConversionHistory.css'

const ConversionHistory = () => {
    const { isAuthenticated, user } = useAuth();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchConversionHistory();
        }
    }, [isAuthenticated, user]);

    const fetchConversionHistory = async () => {
        try {
            const response = await axios.get('/api/conversion-history');
            setHistory(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania historii:', error);
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