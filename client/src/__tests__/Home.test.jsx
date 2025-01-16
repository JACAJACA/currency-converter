import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Home from '../Home';

// Mock the useAuth hook to simulate authentication
jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Home Component', () => {
  test('should render the form correctly', () => {
    // Given: Mocking authenticated user
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: jest.fn(),
    });

    // When: The Home component is rendered
    render(
      <Router>
        <Home />
      </Router>
    );

    // Then: Check if the form elements are present
    const fromSelect = screen.getByLabelText(/From Currency/i);
    const toSelect = screen.getByLabelText(/To Currency/i);
    const amountInput = screen.getByLabelText(/Amount/i);
    const submitButton = screen.getByRole('button', { name: /Convert/i });

    expect(fromSelect).toBeInTheDocument();
    expect(toSelect).toBeInTheDocument();
    expect(amountInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('should display logout button and handle click', () => {
    // Given: Mocking authenticated user
    const logoutMock = jest.fn();
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: logoutMock,
    });

    // When: The Home component is rendered
    render(
      <Router>
        <Home />
      </Router>
    );

    // Then: Check if the logout button is rendered and can be clicked
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();

    // When: Clicking the logout button
    fireEvent.click(logoutButton);

    // Then: Ensure the logout function was called
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  test('should display correct welcome message with username', () => {
    // Given: Mocking authenticated user
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: jest.fn(),
    });
  
    // When: The Home component is rendered
    render(
      <Router>
        <Home />
      </Router>
    );
  
    // Then: Check if the welcome message contains the correct username
    const welcomeMessage = screen.getByText(/Welcome,/i); // Matching 'Welcome,' part
    expect(welcomeMessage).toBeInTheDocument();
  
    const username = screen.getByText(/Test User/i); // Matching the username part
    expect(username).toBeInTheDocument();
  });
  
});
