import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../axiosConfig';
import ConversionHistory from '../ConversionHistory';

// Mocking the useAuth hook
jest.mock('../AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mocking the api instance
jest.mock('../axiosConfig', () => {
    return {
      get: jest.fn(),
      defaults: {
        headers: {
          common: {},
        },
      },
    };
  });
  

describe('ConversionHistory Component', () => {
  test('should render conversion history list when data is available', async () => {
    // GIVEN: Mocking authentication and API response  
    useAuth.mockReturnValue({
        isAuthenticated: true,
        user: { name: 'Test User' },
    });

    api.get.mockResolvedValue({
        data: [
            {
                fromCurrency: 'USD',
                toCurrency: 'EUR',
                amount: '100',
                convertedAmount: '85',
                conversionRate: '0.85',
                conversionDate: '2025-01-16T00:00:00Z',
            },
        ],
    });

    // Mock toLocaleString() for consistent date formatting in tests  
    jest.spyOn(Date.prototype, 'toLocaleString').mockReturnValue('1/16/2025, 12:00:00 AM');

    // WHEN: The ConversionHistory component is rendered  
    render(
        <Router>
            <ConversionHistory />
        </Router>
    );

    // THEN: The conversion history data should be displayed correctly  
    await waitFor(() => {
        expect(screen.getByText(/From: USD, To: EUR/i)).toBeInTheDocument();
        expect(screen.getByText(/Amount: 100 USD, Converted: 85 EUR/i)).toBeInTheDocument();
        expect(screen.getByText(/Rate: 0.85/i)).toBeInTheDocument();
        expect(screen.getByText(/Date:/i)).toBeInTheDocument(); // More flexible date check  
    });
});



  test('should show a message when no conversion history is available', async () => {
    // Given: Mocking authenticated user and an empty API response
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
    });

    api.get.mockResolvedValue({
      data: [], // No history data
    });

    // When: The ConversionHistory component is rendered
    render(
      <Router>
        <ConversionHistory />
      </Router>
    );

    // Then: Show the "No conversion history available" message
    await waitFor(() => {
      expect(screen.getByText(/No conversion history available/i)).toBeInTheDocument();
    });
  });
});
