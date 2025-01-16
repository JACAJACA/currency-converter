import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../Home'; // Ścieżka do Twojego komponentu Home
import api from '../axiosConfig'; // Ścieżka do pliku api, w którym jest konfiguracja axios
import { useAuth } from '../AuthContext'; // Ścieżka do kontekstu uwierzytelniania

jest.mock('../axiosConfig'); // Mockowanie axios
jest.mock('../AuthContext'); // Mockowanie kontekstu autoryzacji

describe('Token Refresh Integration Test', () => {
  test('should refresh the token and continue with the request after it expires', async () => {
    // Mockowanie odpowiedzi dla tokenu wygasłego
    api.post.mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Token expired' } },
    });

    // Mockowanie odpowiedzi dla odświeżenia tokenu
    api.post.mockResolvedValueOnce({
      data: { token: 'new-token' },
    });

    // Mockowanie odpowiedzi dla konwersji po odświeżeniu tokenu
    api.post.mockResolvedValueOnce({
      data: { conversionAmount: 85, target: 'EUR', conversionRate: 0.85 },
    });

    // Mockowanie użycia kontekstu, aby zasymulować zalogowanego użytkownika
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: jest.fn(),
    });

    // Wstępne ustawienie tokenu w localStorage (symulacja zalogowanego użytkownika)
    localStorage.setItem('token', 'expired-token');

    render(
      <Router>
        <Home />
      </Router>
    );

    // Próbujemy wykonać żądanie do konwersji z wygasłym tokenem
    fireEvent.change(screen.getByLabelText(/From Currency/i), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText(/To Currency/i), { target: { value: 'EUR' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    const submitButton = screen.getByRole('button', { name: /Convert/i });
    
    fireEvent.click(submitButton);

    // Sprawdzamy, czy żądanie odświeżenia tokenu zostało wysłane
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/refresh-token', { token: 'expired-token' });
    });

    // Sprawdzamy, czy nowy token został zapisany w localStorage
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('new-token');
    });

    // Sprawdzamy, czy po odświeżeniu tokenu aplikacja wyświetla poprawny wynik konwersji
    await waitFor(() => {
      expect(screen.getByText(/Converted Amount:/i)).toBeInTheDocument();
      expect(screen.getByText(/Converted Amount: 85 EUR/i)).toBeInTheDocument();
    });
  });

  test('should display an error message if token refresh fails', async () => {
    // Mockowanie odpowiedzi dla tokenu wygasłego
    api.post.mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Token expired' } },
    });

    // Mockowanie odpowiedzi dla odświeżenia tokenu (błąd odświeżenia)
    api.post.mockRejectedValueOnce({
      response: { status: 500, data: { message: 'Token refresh failed' } },
    });

    // Mockowanie użycia kontekstu, aby zasymulować zalogowanego użytkownika
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      logout: jest.fn(),
    });

    // Wstępne ustawienie tokenu w localStorage (symulacja zalogowanego użytkownika)
    localStorage.setItem('token', 'expired-token');

    render(
      <Router>
        <Home />
      </Router>
    );

    // Próbujemy wykonać żądanie do konwersji z wygasłym tokenem
    fireEvent.change(screen.getByLabelText(/From Currency/i), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText(/To Currency/i), { target: { value: 'EUR' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    const submitButton = screen.getByRole('button', { name: /Convert/i });
    
    fireEvent.click(submitButton);

    // Sprawdzamy, czy żądanie odświeżenia tokenu zostało wysłane
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/refresh-token', { token: 'expired-token' });
    });

    // Sprawdzamy, czy aplikacja wyświetla odpowiedni komunikat o błędzie
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Token refresh failed. Please log in again.');
    });

    // Sprawdzamy, czy użytkownik został wylogowany i przekierowany na stronę logowania
    await waitFor(() => {
      expect(useAuth().logout).toHaveBeenCalled();
    });
  });
});
