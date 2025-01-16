import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { useAuth } from '../AuthContext';
import api from '../axiosConfig';
import { act } from 'react-dom/test-utils';

// Mock the axiosConfig module properly
vi.mock('../axiosConfig', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock the AuthContext module
vi.mock('../AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Login Component', () => {
  let loginMock;

  beforeEach(() => {
    loginMock = vi.fn();
    useAuth.mockReturnValue({ login: loginMock });
    // Mock console.error before each test
    vi.spyOn(global.console, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  it('should render login form', async () => {
    // Given
    // We are rendering the Login component within a BrowserRouter context

    // When
    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });

    // Then
    expect(screen.getByText(/Login./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('should update email and password fields', async () => {
    // Given
    // We have rendered the Login component

    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });

    const emailInput = screen.getByPlaceholderText(/Enter Email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter Password/i);

    // When
    // We change the values in email and password inputs
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    // Then
    // We expect the values of email and password inputs to be updated
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call API and login on form submit', async () => {
    // Given
    // We have a mock response for a successful login
    const mockResponse = {
      data: {
        auth: true,
        token: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        user: { id: '123', name: 'Test User', email: 'test@example.com' },
      },
    };

    // Mock the resolved value of the POST request
    api.post.mockResolvedValue(mockResponse);

    // When
    // We render the Login component and simulate form submission
    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });

    const emailInput = screen.getByPlaceholderText(/Enter Email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter Password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);
    });

    // Then
    // We expect the API to be called with the correct credentials
    expect(api.post).toHaveBeenCalledWith(
      'http://localhost:5000/login',
      {
        email: 'test@example.com',
        password: 'password123',
      }
    );

    // And we expect the login function to be called with the correct mock response data
    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        token: 'mockAccessToken',
        refreshToken: 'mockRefreshToken',
        user: { id: '123', name: 'Test User', email: 'test@example.com' },
      });
    });
  });

  it('should show error message if login fails', async () => {
    // Given
    // We have a mock rejection for a failed login attempt
    api.post.mockRejectedValue(new Error('Login failed'));
  
    // When
    // We render the Login component and simulate clicking the login button
    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
    });
  
    // We are waiting for the component to re-render
    await waitFor(() => {
      const loginButton = screen.getByRole('button', { name: /Login/i });
      act(() => {
        fireEvent.click(loginButton);
      });
    });
  
    // Then
    // We expect an error to be logged to console
    await waitFor(() => {
      expect(global.console.error).toHaveBeenCalledWith('Error while logging in:', expect.any(Error));
    });
  });
});