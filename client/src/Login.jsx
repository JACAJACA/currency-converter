import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming you create this file for custom styles

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
        .then(result => {
            console.log(result);
            if(result.data === "Success") {
                navigate('/home');
            }
        })
        .catch(err => console.log(err));
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