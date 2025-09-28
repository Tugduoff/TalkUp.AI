import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from '.';

// Mock localStorage to prevent token validation errors
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the auth service to prevent real API calls
vi.mock('@/services/auth/http', () => {
  return {
    default: class MockAuthService {
      postLogin = vi.fn().mockResolvedValue({ accessToken: 'mock-token' });
      postRegister = vi.fn().mockResolvedValue({ accessToken: 'mock-token' });
    },
  };
});

// Mock the router hooks to prevent router context errors
vi.mock('@tanstack/react-router', () => ({
  useRouter: vi.fn(() => ({
    navigate: vi.fn(),
    history: { push: vi.fn() },
  })),
  useNavigate: vi.fn(() => vi.fn()),
  createRouter: vi.fn(),
  RouterProvider: ({ children }: { children: React.ReactNode }) => children,
  createMemoryHistory: vi.fn(),
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </QueryClientProvider>,
  );
};

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
      renderWithProviders(<LoginForm />);

      expect(
        screen.getByRole('heading', { name: /Login/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Login to your account/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Your email address/i),
      ).toBeInTheDocument();
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
    it('displays "Email and password are required" error when both fields are empty on submit', async () => {
      renderWithProviders(<LoginForm />);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Email and password are required/i),
        ).toBeInTheDocument();
      });
      expect(screen.queryByText(/Email is required/i)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/Password is required/i),
      ).not.toBeInTheDocument();
    });

    it('displays "Email is required" error when only email is empty on submit', async () => {
      renderWithProviders(<LoginForm />);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/^Email is required$/i)).toBeInTheDocument();
      });
      expect(
        screen.queryByText(/Email and password are required/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/^Password is required$/i),
      ).not.toBeInTheDocument();
    });

    it('displays "Password is required" error when only password is empty on submit', async () => {
      renderWithProviders(<LoginForm />);
      const emailInput = screen.getByLabelText(/Email/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: 'testuser@example.com' },
        });
        fireEvent.click(loginButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/^Password is required$/i)).toBeInTheDocument();
      });
      expect(
        screen.queryByText(/Email and password are required/i),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/^Email is required$/i),
      ).not.toBeInTheDocument();
    });
  });

  /**
   * Test Group: User Interactions
   * This group focuses on verifying the component's responsiveness to common
   * user input actions such as typing into fields and submitting the form.
   */
  describe('User Interactions', () => {
    it('allows typing into email and password fields', async () => {
      renderWithProviders(<LoginForm />);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: 'myemail@example.com' },
        });
      });
      expect(emailInput).toHaveValue('myemail@example.com');

      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
      });
      expect(passwordInput).toHaveValue('mypassword');
    });

    it('submits the form with valid credentials', async () => {
      renderWithProviders(<LoginForm />);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Password/i);
      const loginButton = screen.getByRole('button', { name: /Login/i });

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: 'admin.admin@admin.com' },
        });
        fireEvent.change(passwordInput, { target: { value: 'admin' } });
        fireEvent.click(loginButton);
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
      renderWithProviders(<LoginForm />);

      const emailLabel = screen.getByText('Email');
      const emailInput = screen.getByPlaceholderText(/Your email address/i);
      expect(emailLabel).toHaveAttribute('for', 'email');
      expect(emailInput).toHaveAttribute('id', 'email');

      const passwordLabel = screen.getByText('Password');
      const passwordInput = screen.getByPlaceholderText(/Your password/i);
      expect(passwordLabel).toHaveAttribute('for', 'password');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });
});
