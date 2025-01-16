import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../Login'; // Poprawiona ścieżka do komponentu Login
import { AuthProvider, useAuth } from '../AuthContext'; // Poprawiona ścieżka do AuthContext
import Home from '../Home';

// Mockowanie 'react-router-dom', w tym 'BrowserRouter', 'useNavigate' oraz 'Link'
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => vi.fn(),
  Link: ({ children }) => <a>{children}</a>, // Mockowanie Linka
}));

// Mockowanie useAuth hook
vi.mock('../AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
  }),
}));

describe('Login Component', () => {
  test('renders Login form', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    // Sprawdzenie, czy elementy formularza są widoczne
    expect(screen.getAllByText(/Login/i)).toHaveLength(2);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  test('calls handleSubmit when form is submitted', () => {
    const { login } = Login; // Poprawiony import login
    const home = Home;
  
    render(
      <Router home={home}>
          <Login />
      </Router>
    );
  
    // Wyszukiwanie elementów formularza
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });
  
    // Wypełnianie formularza
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
    // Wysłanie formularza
    fireEvent.click(loginButton);
  
    // Sprawdzenie, czy funkcja login została wywołana
    expect(login).toHaveBeenCalledTimes(1);
  });
});
