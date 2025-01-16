import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './axiosConfig';
import { useAuth } from './AuthContext';
import './Login.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('http://localhost:5000/login', { email, password });
            if (response.data.auth) {
                login({ token: response.data.token, refreshToken: response.data.refreshToken, user: response.data.user });
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('refresh_token', response.data.refreshToken);
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/home');
            } else {
                console.error('Login failed:', response.data);
            }
        } catch (err) {
            console.error('Error while logging in:', err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <strong>Email:</strong>
                        </label>
                        <input 
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <strong>Password:</strong>
                        </label>
                        <input 
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-submit">Login</button>
                </form>
                <p className="register-text">Don't have an account?</p>
                <Link to="/register" className="btn-register">Register</Link>
            </div>
        </div>
    );
};

export default Login;