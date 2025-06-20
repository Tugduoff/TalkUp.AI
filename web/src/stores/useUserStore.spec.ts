import { User } from '@/types/user';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import useUserStore from './useUserStore';

const initialStoreState = useUserStore.getState();

/**
 * Test suite for the useUserStore Zustand store.
 * Verifies the store's initial state and the functionality of its actions (setUser, clearUser).
 */
describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState(initialStoreState, true);
  });

  it('should return the initial state with a null user', () => {
    const { result } = renderHook(() => useUserStore());

    expect(result.current.user).toBeNull();
  });

  it('should correctly set a user object', () => {
    const { result } = renderHook(() => useUserStore());

    const mockUser: User = {
      id: 'user123',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
    };

    act(() => {
      result.current.setUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should overwrite an existing user with a new user', () => {
    const { result } = renderHook(() => useUserStore());

    const firstUser: User = {
      id: 'userA',
      firstName: 'User',
      lastName: 'A',
      email: 'a@example.com',
    };
    act(() => {
      result.current.setUser(firstUser);
    });
    expect(result.current.user).toEqual(firstUser);

    const secondUser: User = {
      id: 'userB',
      firstName: 'User',
      lastName: 'B',
      email: 'b@example.com',
    };
    act(() => {
      result.current.setUser(secondUser);
    });

    expect(result.current.user).toEqual(secondUser);
  });

  it('should clear the user by setting the state to null', () => {
    const { result } = renderHook(() => useUserStore());

    const userToClear: User = {
      id: 'user456',
      firstName: 'Another',
      lastName: 'User',
      email: 'another@example.com',
    };
    act(() => {
      result.current.setUser(userToClear);
    });
    expect(result.current.user).toEqual(userToClear);

    act(() => {
      result.current.clearUser();
    });

    expect(result.current.user).toBeNull();
  });

  it('should remain null if clearUser is called when user is already null', () => {
    const { result } = renderHook(() => useUserStore());

    expect(result.current.user).toBeNull();

    act(() => {
      result.current.clearUser();
    });

    expect(result.current.user).toBeNull();
  });
});
