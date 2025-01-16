// src/__tests__/Home.test.jsx
import React, { act } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../Home';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import { vi } from 'vitest';

// Mockowanie AuthContext dla testów
vi.mock('../AuthContext', () => {
  const mockLogout = vi.fn();
  return {
    useAuth: () => ({
      isAuthenticated: true,
      user: { name: 'TestUser' },
      logout: mockLogout,
    }),
    AuthProvider: ({ children }) => <>{children}</>,
  };
});

// Mockowanie axios
vi.mock('axios', () => ({
  default: vi.fn(),
}));

describe('Home Component', () => {
  // Test 1: Sprawdzenie renderowania komponentu Home
  test('renders Home component correctly', () => {
    // Arrange/Given
    render(
      <Router>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </Router>
    );

    // Act/When
    // W tym przypadku nie potrzebujemy akcji, bo testujemy renderowanie

    // Assert/Then
    expect(screen.getByText(/Currency Converter/i)).toBeInTheDocument();
    
    // Używamy bardziej elastycznego matchera dla tekstu powitania
    expect(screen.getByText((_, node) => {
      const hasText = (node) => node.textContent === 'Welcome, TestUser' || node.textContent === 'Welcome, TestUser';
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
      return nodeHasText && childrenDontHaveText;
    })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Convert/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Conversion History/i })).toBeInTheDocument();
  });

  // Test 2: Sprawdzenie interakcji z formularzem konwersji
  test('handles form submission', async () => {
    // Arrange/Given
    const mockResponse = { data: {conversionRate: 0.85 , convertedAmount: 85} };
    const axiosMock = vi.mocked(vi.fn(), true);
    axiosMock.mockResolvedValue(mockResponse);

    render(
      <Router>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </Router>
    );

    // Act/When
    await userEvent.selectOptions(screen.getByLabelText(/From Currency/i), 'USD');
    await userEvent.selectOptions(screen.getByLabelText(/To Currency/i), 'EUR');
    await userEvent.type(screen.getByLabelText(/Amount/i), '100');
    await userEvent.click(screen.getByRole('button', { name: /Convert/i }));

    // Assert/Then
    // Używamy queryByText, aby sprawdzić, czy element istnieje
    await waitFor(() => {
    const convertedAmountElement = screen.queryByText(/Converted Amount:/i);
    expect(convertedAmountElement).toHaveTextContent(/85 EUR/i);

    const conversionRateElement = screen.queryByText(/Conversion Rate:/i);
    expect(conversionRateElement).toHaveTextContent(/Conversion Rate: 0.85/i);
    });
  });

  // Test 3: Sprawdzenie wylogowywania
  test('handles logout', async () => {
    // Arrange/Given
    // Mockowanie AuthContext jest już zdefiniowane na początku pliku

    render(
      <Router>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </Router>
    );

    // Act/When
    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    userEvent.click(logoutButton);

    // Assert/Then
    await waitFor(() => {
      // Teraz możemy używać mockLogout zdefiniowanego w mocku AuthContext
      expect(vi.mocked(vi.importActual('../AuthContext')).useAuth().logout).toHaveBeenCalledTimes(1);
    });
  });

  test('renders form fields correctly', () => {
    render(
      <Router>
        <Home />
      </Router>
  );

    expect(screen.getByLabelText(/from currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to currency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByText('Convert')).toBeInTheDocument();
  });

  test('submits form successfully and shows result', async () => {
    // Mocking successful API response
    const mockResponse = ({
      data: {
        conversionAmount: 120,
        target: 'EUR',
        conversionRate: 1.2,
      },
    });
    const axiosMock = vi.mocked(vi.fn(), true);
    axiosMock.mockResolvedValue(mockResponse);
    
    
    render(
      <Router>
        <Home />
      </Router>
  );


    // Simulate filling out the form
    fireEvent.change(screen.getByLabelText(/from/i), {
      target: { value: 'USD' },
    });
    fireEvent.change(screen.getByLabelText(/to currency/i), {
      target: { value: 'EUR' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '100' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText('Convert'));

    await setup(() => {
      // Custom matcher function for "Converted Amount"
      expect(screen.getByText((_, node) => {
        const hasText = (node) => node.textContent.includes('Converted Amount:') && node.textContent.includes('120 EUR');
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      })).toBeInTheDocument();
  
      // Custom matcher function for converted amount value
      expect(screen.getByText((_, node) => {
        const hasText = (node) => node.textContent === '120 EUR' || node.textContent.includes('120 EUR');
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      })).toBeInTheDocument();
  
      // Custom matcher function for "Conversion Rate"
      expect(screen.getByText((_, node) => {
        const hasText = (node) => node.textContent === 'Conversion Rate:' || node.textContent.includes('Conversion Rate:');
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      })).toBeInTheDocument();
  
      // Custom matcher function for conversion rate value
      expect(screen.getByText((_, node) => {
        const hasText = (node) => node.textContent === '1.2' || node.textContent.includes('1.2');
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
        return nodeHasText && childrenDontHaveText;
      })).toBeInTheDocument();
    });
  });
});