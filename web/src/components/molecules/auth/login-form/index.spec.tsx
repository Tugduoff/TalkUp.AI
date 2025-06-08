import { validateLogin } from '@/utils/validateLogin';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockedFunction, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from '.';

/**
 * Mocks the `validateLogin` utility function.
 * This mock simulates an asynchronous operation that resolves after a 100ms delay.
 * It allows controlled testing of loading states and successful/failed login scenarios.
 */
vi.mock('@/utils/validateLogin', () => ({
  validateLogin: vi.fn(() => {
    return new Promise((resolve) => setTimeout(resolve, 100));
  }),
}));

const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

/**
 * Test suite for the LoginForm component.
 * This suite covers rendering, client-side validation, asynchronous validation,
 * user interactions, and accessibility aspects of the form.
 */
describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test Group: Initial Render and Basic Structure
   * Verifies that all essential elements of the LoginForm are correctly rendered
   * when the component is first mounted.
   */
  describe('Initial Render and Basic Structure', () => {
    it('renders the login form elements correctly', () => {
      render(<LoginForm />);

      expect(
        screen.getByRole('heading', { name: /Login/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Login to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Your username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Your password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Login/i }),
      ).toBeInTheDocument();
    });
  });

  /**
   * Test Group: Client-Side Validation (Synchronous Validators)
   * This group focuses on testing the immediate, synchronous validation rules
   * applied to the form fields on submission.
   */
  describe('Client-Side Validation (Sync Validators)', () => {
    it('displays "Username and password are required" error when both fields are empty on submit', async () => {
      render(<LoginForm />);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Username and password are required/i),
        ).toBeInTheDocument();
      });
      expect(
        screen.queryByText(/Username is required/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Password is required/i),
      ).not.toBeInTheDocument();
    });

    it('displays "Username is required" error when only username is empty on submit', async () => {
      render(<LoginForm />);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/^Username is required$/i)).toBeInTheDocument();
      });
      expect(
        screen.queryByText(/Username and password are required/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/^Password is required$/i),
      ).not.toBeInTheDocument();
    });

    it('displays "Password is required" error when only password is empty on submit', async () => {
      render(<LoginForm />);
      const usernameInput = screen.getByLabelText(/Username/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/^Password is required$/i)).toBeInTheDocument();
      });
      expect(
        screen.queryByText(/Username and password are required/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/^Username is required$/i),
      ).not.toBeInTheDocument();
    });
  });

  /**
   * Test Group: Asynchronous Validation (validateLogin)
   * This group verifies the behavior of the form when interacting with the
   * mocked `validateLogin` function, including error display and successful outcomes.
   */
  describe('Asynchronous Validation (validateLogin)', () => {
    const mockedValidateLogin = validateLogin as MockedFunction<
      typeof validateLogin
    >;

    it('displays an error when validateLogin rejects (simulated failed login)', async () => {
      mockedValidateLogin.mockImplementationOnce(() =>
        Promise.reject('Invalid credentials provided'),
      );

      render(<LoginForm />);
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Invalid credentials provided/i),
        ).toBeInTheDocument();
      });
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('does not display an error when validateLogin resolves (simulated successful login)', async () => {
      mockedValidateLogin.mockResolvedValueOnce(undefined);

      render(<LoginForm />);
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(
          screen.queryByText(/Invalid credentials provided/i),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Username is required/i),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Password is required/i),
        ).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Login:', {
          username: 'testuser',
          password: 'password123',
        });
      });
    });
  });

  /**
   * Test Group: User Interactions
   * This group focuses on verifying the component's responsiveness to common
   * user input actions such as typing into fields and submitting the form.
   */
  describe('User Interactions', () => {
    it('allows typing into username and password fields', async () => {
      render(<LoginForm />);
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'myusername' } });
      });
      expect(usernameInput).toHaveValue('myusername');

      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
      });
      expect(passwordInput).toHaveValue('mypassword');
    });

    it('submits the form with valid credentials', async () => {
      render(<LoginForm />);
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(validateLogin).toHaveBeenCalledWith({
          username: 'admin',
          password: 'admin',
        });
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Login:', {
          username: 'admin',
          password: 'admin',
        });
      });
    });
  });

  /**
   * Test Group: Accessibility
   * This group ensures that the LoginForm adheres to basic accessibility standards,
   * specifically checking for correct labeling and input associations.
   */
  describe('Accessibility', () => {
    it('ensures correct htmlFor attributes on labels and id on inputs', () => {
      render(<LoginForm />);

      const usernameLabel = screen.getByText('Username');
      const usernameInput = screen.getByPlaceholderText(/Your username/i);
      expect(usernameLabel).toHaveAttribute('for', 'username');
      expect(usernameInput).toHaveAttribute('id', 'username');

      const passwordLabel = screen.getByText('Password');
      const passwordInput = screen.getByPlaceholderText(/Your password/i);
      expect(passwordLabel).toHaveAttribute('for', 'password');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });
});
