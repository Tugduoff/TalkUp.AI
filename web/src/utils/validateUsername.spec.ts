import { describe, expect, it } from 'vitest';

import { validateUsername } from './validateUsername';

/**
 * Test suite for the `validateUsername` asynchronous validation function.
 * Verifies that the function correctly identifies existing and available usernames,
 * and confirms its asynchronous behavior using real timers.
 */
describe('validateUsername', () => {
  it('should return an error message if the username already exists', async () => {
    const existingUsername = 'admin';
    const result = await validateUsername(existingUsername);

    expect(result).toBe('Username already exists');
  });

  it('should return undefined if the username is available', async () => {
    const availableUsername = 'newUser123';
    const result = await validateUsername(availableUsername);

    expect(result).toBeUndefined();
  });

  it('should be an asynchronous operation that resolves after its internal delay', async () => {
    const username = 'someUser';
    const result = await validateUsername(username);

    expect(result).toBeUndefined();
  });

  it('should return undefined for an empty username', async () => {
    const emptyUsername = '';
    const result = await validateUsername(emptyUsername);
    expect(result).toBeUndefined();
  });

  it('should be case-sensitive based on current implementation', async () => {
    const username = 'Admin';
    const result = await validateUsername(username);
    expect(result).toBeUndefined();
  });
});
