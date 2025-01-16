import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext'; // Import AuthContext for authentication
import Home from '../Home'; // Import the Home component

// Mocking the router hooks (useNavigate) and API calls
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mocking the useAuth hook for authentication
jest.mock('../AuthContext', () => ({
  ...jest.requireActual('../AuthContext'),
  useAuth: jest.fn(),
}));

describe('Home to Login and Home to ConversionHistory Integration Test', () => {
  let mockNavigate; // Mock function for navigation
  let mockLogout; // Mock function for logout

  beforeEach(() => {
    // Setup mock functions for each test case
    mockNavigate = jest.fn();
    mockLogout = jest.fn();

    // Mock the useNavigate and useAuth hooks to simulate user authentication and navigation
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      isAuthenticated: true, // Simulating an authenticated user
      user: { name: 'Test User' }, // Mock user data
      logout: mockLogout, // Mock logout function
    });
  });

  // Test case for ensuring that clicking on the logout button redirects to login page
  test('should redirect to login when logout button is clicked', async () => {
    render(
      <Router>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </Router>
    );

    // Given: Check that the user is displayed on the Home page with "Welcome, Test User"
    const welcomeMessage = screen.getByText(/Welcome,/i); // Match the "Welcome," part of the text
    expect(welcomeMessage).toBeInTheDocument();
      
    const username = screen.getByText(/Test User/i); // Match the username part
    expect(username).toBeInTheDocument();

    // When: Simulate a click on the "Logout" button
    fireEvent.click(screen.getByText(/Logout/i));

    // Then: Check if the logout function was called and the user was redirected to login page
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled(); // Ensure logout was called
      expect(mockNavigate).toHaveBeenCalledWith('/login'); // Ensure navigation to login page
    });
  });

  // Test case for ensuring that clicking on the "View Conversion History" button redirects to the ConversionHistory page
  test('should redirect to ConversionHistory when history button is clicked', async () => {
    render(
      <Router>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </Router>
    );

    // Given: Ensure the user sees "Welcome, Test User" on the Home page
    const welcomeMessage = screen.getByText(/Welcome,/i); // Match the "Welcome," part
    expect(welcomeMessage).toBeInTheDocument();
      
    const username = screen.getByText(/Test User/i); // Match the username part
    expect(username).toBeInTheDocument();

    // When: Simulate a click on the "View Conversion History" button
    fireEvent.click(screen.getByText(/View Conversion History/i));

    // Then: Ensure the user is redirected to the ConversionHistory page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/history'); // Ensure navigation to the ConversionHistory page
    });
  });
});
