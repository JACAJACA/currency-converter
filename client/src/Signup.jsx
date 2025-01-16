import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './axiosConfig';
import './Signup.css'

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('http://localhost:5000/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            console.error('Błąd podczas rejestracji:', err);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="title">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            <strong>Name:</strong>
                        </label>
                        <input 
                            type="text"
                            id="name"
                            placeholder="Enter Name"
                            autoComplete="off"
                            name="name"
                            className="form-control"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                    <button type="submit" className="btn-submit">Register</button>
                </form>
                <p className="login-text">Already have an account?</p>
                <Link to="/login" className="btn-login">Login</Link>
            </div>
        </div>
    );
};

export default Signup;