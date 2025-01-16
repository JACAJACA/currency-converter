import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // To mock useNavigate
import api from '../axiosConfig'; // To mock API calls
import Signup from '../Signup'; // Ensure correct path

// Mock the axios API call
jest.mock('../axiosConfig', () => ({
  post: jest.fn(),
}));

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Signup Component', () => {

  test('should render signup form correctly', () => {
    // Given: The Signup component is rendered
    render(
      <Router>
        <Signup />
      </Router>
    );

    // When: We check for the presence of form elements
    const nameInput = screen.getByLabelText(/Name:/i);
    const emailInput = screen.getByLabelText(/Email:/i);
    const passwordInput = screen.getByLabelText(/Password:/i);
    const submitButton = screen.getByRole('button', { name: /Register/i });

    // Then: All elements should be in the document
    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('should handle form submission and API call', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate); // Mocking useNavigate to ensure it works

    // Mocking successful API response
    api.post.mockResolvedValue({ data: { message: 'User registered successfully' } });

    render(
      <Router>
        <Signup />
      </Router>
    );

    // Simulate filling in the form
    fireEvent.change(screen.getByPlaceholderText('Enter Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Email'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Password'), { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Then: Check if the API post method was called with correct parameters
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('http://localhost:5000/register', {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

      // And check if navigation happened after successful registration
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
