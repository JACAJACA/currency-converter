import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../Login';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';  // Axios instance
import { AuthProvider } from '../AuthContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../axiosConfig');  // Mock the axios instance

test('should redirect to home after successful login', async () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate);

  // Mocking the API response
  api.post.mockResolvedValue({
    data: {
      auth: true,
      token: 'fakeToken',
      refreshToken: 'fakeRefreshToken',
      user: { name: 'Test User' },
    },
  });

  render(
    <Router>
        <AuthProvider>
            <Login />
        </AuthProvider>
    </Router>
  );

  // Simulate filling out the login form
  fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password:/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByText('Login'));

  // Wait for the API call to complete and verify the redirection
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
