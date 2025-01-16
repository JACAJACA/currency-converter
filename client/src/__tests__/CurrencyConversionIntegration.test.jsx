import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import useAuth
import Home from '../Home';
import api from '../axiosConfig'; // Import the api configuration

// Mock the useAuth hook and axiosConfig
jest.mock('../axiosConfig');
jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Home Component - Currency Conversion Integration Test', () => {
  let mockNavigate;
  let mockLogout;

  beforeEach(() => {
    mockNavigate = jest.fn(); // Mock the navigate function
    mockLogout = jest.fn(); // Mock the logout function

    // Mocking the API defaults to ensure no undefined errors
    api.defaults = { headers: { common: {} } }; // Initialize headers.common

    // Mock useAuth
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: mockLogout,
    });

    // Mock the navigate function
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: jest.fn(),
    }));
  });

  test('should display conversion result after successful conversion request', async () => {
    // Mock the API request
    api.post.mockResolvedValue({
      data: {
        conversionAmount: 85,
        target: 'EUR',
        conversionRate: 0.85,
      },
    });

    render(
      <Router>
        <Home />
      </Router>
    );

    // Given: User sees the "Welcome" message
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();

    // When: Fill the form and submit the conversion
    fireEvent.change(screen.getByLabelText(/From Currency/i), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText(/To Currency/i), { target: { value: 'EUR' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });

    const convertButton = screen.getByRole('button', { name: /Convert/i });
    fireEvent.click(convertButton);

    // Then: Check the conversion result is displayed
    await waitFor(() => {
      expect(screen.getByText(/Converted Amount:/i)).toHaveTextContent('85 EUR');
      expect(screen.getByText(/Conversion Rate:/i)).toHaveTextContent('0.85');
    });
  });

  test('should display an error message if conversion fails', async () => {
    // Mock the API to return an error response
    api.post.mockRejectedValue({
      response: { data: { message: 'Conversion failed' } },
    });

    render(
      <Router>
        <Home />
      </Router>
    );

    // Given: The user is logged in and sees the "Welcome" message
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();

    // When: Fill in the conversion form and submit it
    fireEvent.change(screen.getByLabelText(/From Currency/i), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText(/To Currency/i), { target: { value: 'EUR' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    const convertButton = screen.getByRole('button', { name: /Convert/i });
    fireEvent.click(convertButton);

    // Then: Check if an error message is displayed
    await waitFor(() => {
        expect(screen.getByText(/Conversion failed/i)).toBeInTheDocument();
    });
  });
});
