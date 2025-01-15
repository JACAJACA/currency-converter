import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const userData = JSON.parse(sessionStorage.getItem('user'));
        console.log('On refresh, token:', token, 'user:', userData);
        if (token && userData) {
            setIsAuthenticated(true);
            setUser(userData);
        }
    }, []);

    const login = ({ token, user }) => {
        console.log('Logging in with token:', token, 'and user:', user);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        setUser(user);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);