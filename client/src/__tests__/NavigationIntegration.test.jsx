import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import Login from '../Login';
import Signup from '../Signup';
import Home from '../Home';
import api from '../axiosConfig';

// Mockowanie API i useNavigate
jest.mock('../axiosConfig', () => ({
  post: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

test('should redirect user to login after successful registration', async () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate);

  api.post.mockResolvedValue({
    data: { success: true, message: 'User registered successfully' },
  });

  render(
    <Router>
      <AuthProvider>
        <Signup />
      </AuthProvider>
    </Router>
  );

  // Wypełnienie formularza rejestracji
  fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });

  fireEvent.click(screen.getByText('Register'));

  // Oczekiwanie na przekierowanie
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

test('should redirect user to home after successful login', async () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate);

  api.post.mockResolvedValue({
    data: { auth: true, token: 'fakeToken', refreshToken: 'fakeRefresh', user: { name: 'Test User' } },
  });

  render(
    <Router>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </Router>
  );

  // Wypełnienie formularza i kliknięcie przycisku login
  fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByText('Login'));

  // Oczekiwanie na przekierowanie
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});

test('should navigate to signup screen when Register link is clicked', () => {
  render(
    <Router>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </Router>
  );

  // Szukamy linku "Register" na ekranie logowania
  const registerLink = screen.getByRole('link', { name: /register/i });

  // Klikamy link "Register"
  fireEvent.click(registerLink);

  // Sprawdzamy, czy użytkownik został przekierowany na stronę rejestracji
  expect(screen.getByText(/register/i)).toBeInTheDocument();
});