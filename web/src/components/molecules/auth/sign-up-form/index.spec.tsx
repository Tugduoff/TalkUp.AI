import { validateUsername } from '@/utils/validateUsername';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MockedFunction, beforeEach, describe, expect, it, vi } from 'vitest';

import { SignUpForm } from '.';

/**
 * Mocks the `usePostRegister` hook.
 */
vi.mock('@/hooks/auth/useServices', () => ({
  usePostRegister: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

/**
 * Mocks the `validateUsername` utility function.
 * This mock simulates async validation by resolving with an error message for a specific user
 * and resolving with `undefined` for others, which is how react-hook-form expects async validators to work.
 */
vi.mock('@/utils/validateUsername', () => ({
  validateUsername: vi.fn(async (username: string) => {
    await new Promise((res) => setTimeout(res, 100));
    if (username === 'existinguser') {
      return 'Username already taken';
    }
    return undefined;
  }),
}));

/**
 * Test suite for the SignUpForm component.
 * This suite verifies the component's rendering, client-side and asynchronous validation,
 * user interactions, form submission, and integration with external hooks.
 */
describe('SignUpForm', () => {
  let mockValidateUsername: MockedFunction<typeof validateUsername>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockValidateUsername = validateUsername as MockedFunction<
      typeof validateUsername
    >;
  });

  /**
   * Test Group: Initial Render and Basic Structure
   * Ensures that the form and its core elements are rendered correctly on initial load.
   */
  describe('Initial Render and Basic Structure', () => {
    it('renders the signup form elements correctly', () => {
      render(<SignUpForm />);

      expect(
        screen.getByRole('heading', { name: /Sign Up/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/Create a new account/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Your username/i)).toBeInTheDocument();

      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Your email address/i),
      ).toBeInTheDocument();

      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/^Your password$/i),
      ).toBeInTheDocument();

      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(
        screen.getAllByPlaceholderText(/Your password/i)[1],
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: /Sign Up/i }),
      ).toBeInTheDocument();
    });
  });

  /**
   * Test Group: Field Input Handling
   * Verifies that users can type into input fields and their values update correctly.
   */
  describe('Field Input Handling', () => {
    it('allows typing into username field', async () => {
      render(<SignUpForm />);
      const usernameInput = screen.getByLabelText(/Username/i);

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      });
      expect(usernameInput).toHaveValue('newuser');
    });

    it('allows typing into email field', async () => {
      render(<SignUpForm />);
      const emailInput = screen.getByLabelText(/Email/i);

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: 'admin.admin@admin.com' },
        });
      });
      expect(emailInput).toHaveValue('admin.admin@admin.com');
    });

    it('allows typing into password field', async () => {
      render(<SignUpForm />);
      const passwordInput = screen.getByLabelText('Password');

      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'SecurePass123' } });
      });
      expect(passwordInput).toHaveValue('SecurePass123');
    });

    it('allows typing into confirm password field', async () => {
      render(<SignUpForm />);
      const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

      await act(async () => {
        fireEvent.change(confirmPasswordInput, {
          target: { value: 'SecurePass123' },
        });
      });
      expect(confirmPasswordInput).toHaveValue('SecurePass123');
    });
  });

  /**
   * Test Group: Client-Side Synchronous Validation
   * Tests the immediate validation rules for each field (e.g., length, format).
   */
  describe('Client-Side Synchronous Validation', () => {
    /**
     * Test Sub-Group: Username Validation
     * Tests the synchronous validation rules specific to the username field.
     */
    describe('Username Validation', () => {
      it('displays error for username less than 3 characters', async () => {
        render(<SignUpForm />);
        const usernameInput = screen.getByLabelText(/Username/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(usernameInput, { target: { value: 'ab' } });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText('Username must be at least 3 characters long'),
          ).toBeInTheDocument();
        });
      });

      it('displays error for username more than 20 characters', async () => {
        render(<SignUpForm />);
        const usernameInput = screen.getByLabelText(/Username/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(usernameInput, {
            target: { value: 'thisusernameiswaytoolongtobevalid' },
          });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText('Username must be at most 20 characters long'),
          ).toBeInTheDocument();
        });
      });

      it('displays error for username with special characters', async () => {
        render(<SignUpForm />);
        const usernameInput = screen.getByLabelText(/Username/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(usernameInput, { target: { value: 'user!@#' } });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText('Username must contain only letters and numbers'),
          ).toBeInTheDocument();
        });
      });
    });

    /**
     * Test Sub-Group: Phone Number Validation
     * Tests the synchronous validation rules specific to the email field.
     */
    describe('Email Validation', () => {
      it('displays error for invalid email format', async () => {
        render(<SignUpForm />);
        const emailInput = screen.getByLabelText(/Email/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText(
              'Please enter a valid email address',
            ),
          ).toBeInTheDocument();
        });
      });
    });

    /**
     * Test Sub-Group: Password Validation
     * Tests the synchronous validation rules for password complexity.
     */
    describe('Password Validation', () => {
      it('displays error for password less than 8 characters', async () => {
        render(<SignUpForm />);
        const passwordInput = screen.getByLabelText('Password');
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(passwordInput, { target: { value: 'Short1!' } });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText('Password must be at least 8 characters long'),
          ).toBeInTheDocument();
        });
      });

      it('displays error for password more than 20 characters', async () => {
        render(<SignUpForm />);
        const passwordInput = screen.getByLabelText('Password');
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(passwordInput, {
            target: {
              value:
                'ThisPasswordIsSuperLongAndDefinitelyExceedsTwentyCharacters',
            },
          });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText('Password must be at most 20 characters long'),
          ).toBeInTheDocument();
        });
      });

      it('displays error for password missing lowercase letter', async () => {
        render(<SignUpForm />);
        const passwordInput = screen.getByLabelText('Password');
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(passwordInput, {
            target: { value: 'NOLOWERCASE123!' },
          });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText(
              'Password must contain at least one lowercase letter',
            ),
          ).toBeInTheDocument();
        });
      });

      it('displays error for password missing uppercase letter', async () => {
        render(<SignUpForm />);
        const passwordInput = screen.getByLabelText('Password');
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(passwordInput, {
            target: { value: 'nouppercase123!' },
          });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText(
              'Password must contain at least one uppercase letter',
            ),
          ).toBeInTheDocument();
        });
      });

      it('displays error for password missing number', async () => {
        render(<SignUpForm />);
        const passwordInput = screen.getByLabelText('Password');
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(passwordInput, { target: { value: 'NoNumbers!' } });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText('Password must contain at least one number'),
          ).toBeInTheDocument();
        });
      });
    });

    /**
     * Test Sub-Group: Confirm Password Validation
     * Tests that the confirm password field correctly matches the password field.
     */
    describe('Confirm Password Validation', () => {
      it('displays error when passwords do not match', async () => {
        render(<SignUpForm />);
        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
        const signUpButton = screen.getByRole('button', { name: /Sign Up/i });

        await act(async () => {
          fireEvent.change(passwordInput, {
            target: { value: 'Password123!' },
          });
          fireEvent.change(confirmPasswordInput, {
            target: { value: 'Mismatch123!' },
          });
          fireEvent.click(signUpButton);
        });

        await waitFor(() => {
          expect(
            screen.getByText('Passwords do not match'),
          ).toBeInTheDocument();
        });
      });
    });
  });

  /**
   * Test Group: Asynchronous Validation (validateUsername)
   * Focuses on testing the `validateUsername` asynchronous validation and its impact on the UI.
   */
  describe('Asynchronous Validation (validateUsername)', () => {
    it('shows loading spinner during async username validation', async () => {
      render(<SignUpForm />);
      const usernameInput = screen.getByLabelText(/Username/i);

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'checkinguser' } });
      });

      expect(
        await screen.findByTestId('username-loading-spinner'),
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(mockValidateUsername).toHaveBeenCalledWith('checkinguser');
      });
    });

    it('hides loading spinner after async username validation completes', async () => {
      render(<SignUpForm />);
      const usernameInput = screen.getByLabelText(/Username/i);

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'validuser' } });
      });

      await waitFor(() => {
        expect(mockValidateUsername).toHaveBeenCalledWith('validuser');
      });

      await waitFor(() => {
        expect(
          screen.queryByTestId('username-loading-spinner'),
        ).not.toBeInTheDocument();
      });
    });

    it('displays error from async username validation', async () => {
      render(<SignUpForm />);
      const usernameInput = screen.getByLabelText(/Username/i);

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
      });

      expect(
        await screen.findByText('Username already taken'),
      ).toBeInTheDocument();
    });

    it('clears async error when username becomes valid again', async () => {
      render(<SignUpForm />);
      const usernameInput = screen.getByLabelText(/Username/i);

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'existinguser' } });
        fireEvent.blur(usernameInput);
      });

      expect(
        await screen.findByText('Username already taken'),
      ).toBeInTheDocument();
      expect(mockValidateUsername).toHaveBeenCalledWith('existinguser');

      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'newvaliduser' } });
        fireEvent.blur(usernameInput);
      });

      await waitFor(() => {
        expect(mockValidateUsername).toHaveBeenCalledWith('newvaliduser');
      });

      expect(
        screen.queryByText('Username already taken'),
      ).not.toBeInTheDocument();

      expect(mockValidateUsername).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * Test Group: Accessibility
   * Ensures that the form's elements have correct accessibility attributes.
   */
  describe('Accessibility', () => {
    it('ensures correct htmlFor attributes on labels and id on inputs', () => {
      render(<SignUpForm />);

      const usernameLabel = screen.getByText('Username');
      const usernameInput = screen.getByPlaceholderText(/Your username/i);
      expect(usernameLabel).toHaveAttribute('for', 'username');
      expect(usernameInput).toHaveAttribute('id', 'username');

      const emailLabel = screen.getByText('Email');
      const emailInput =
        screen.getByPlaceholderText(/Your email address/i);
      expect(emailLabel).toHaveAttribute('for', 'email');
      expect(emailInput).toHaveAttribute('id', 'email');

      const passwordLabel = screen.getByText('Password');
      const passwordInput = screen.getByLabelText('Password');
      expect(passwordLabel).toHaveAttribute('for', 'password');
      expect(passwordInput).toHaveAttribute('id', 'password');

      const confirmPasswordLabel = screen.getByText('Confirm Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm Password');
      expect(confirmPasswordLabel).toHaveAttribute('for', 'confirmPassword');
      expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword');
    });
  });
});
