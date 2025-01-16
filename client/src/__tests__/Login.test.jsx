import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext'; // Ensure correct import of AuthProvider
import Login from '../Login'; // Ensure correct path
import api from '../axiosConfig';

// Mocking the axios instance
jest.mock('../axiosConfig', () => ({
  post: jest.fn(),
}));

// Mocking react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

/*jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));*/

// Mock console.error to test error logging
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Login Component', () => {
  test('should render login form correctly', () => {
    // Given: The Login component is rendered
    render(
      <Router>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>
    );

    // When: We check for the presence of form elements
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const loginButton = screen.getByText('Login');

    // Then: All elements should be in the document
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('should show error message when login fails', async () => {
    // Given: The Login component is rendered with mocked API failure
    api.post.mockRejectedValue(new Error('Login failed'));
    
    render(
      <Router>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>
    );

    // When: User enters email and password and submits the form for a failed login
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const loginButton = screen.getByText('Login');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    // Then: An error should be logged in the console (since we don't show UI errors here)
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error while logging in:', expect.any(Error));
    });
  });

  test('should disable login button when fields are empty', () => {
    // Given: The Login component is rendered
    render(
      <Router>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>
    );
  
    // When: The email and password fields are empty
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const loginButton = screen.getByText('Login');
  
    // Then: The login button should be disabled
    expect(loginButton).toBeDisabled();
  });
});
