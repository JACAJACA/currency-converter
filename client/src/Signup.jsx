import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              <strong>Name:</strong>
            </label>
            <input 
              type="text"
              id="name"
              placeholder="Enter Name"
              autoComplete="off"
              name="name"
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <strong>Email:</strong>
            </label>
            <input 
              type="email"
              id="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <strong>Password:</strong>
            </label>
            <input 
              type="password"
              id="password"
              placeholder="Enter Password"
              autoComplete="off"
              name="password"
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              <strong>Confirm Password:</strong>
            </label>
            <input 
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="off"
              name="confirmPassword"
              className="form-control rounded-0"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <p>Already have an account</p>
        <Link to="/login" type="button" className="btn btn-outline-primary w-100">Login</Link>
      </div>
    </div>
  );
};

export default Signup;