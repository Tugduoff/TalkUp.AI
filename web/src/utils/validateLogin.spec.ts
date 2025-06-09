import { describe, expect, it } from 'vitest';

import { validateLogin } from './validateLogin';

describe('Validate Login Implementation', () => {
  it('successfully validates the user', async () => {
    const login = {
      username: 'admin',
      password: 'admin',
    };
    const result = await validateLogin(login);
    expect(result).toBeUndefined();
  });

  it("doesn't validate the user with incorrect username", async () => {
    const login = {
      username: 'Bhuvan',
      password: 'admin',
    };
    const result = await validateLogin(login);
    expect(result).toBe('Invalid username or password');
  });

  it("doesn't validate the user with incorrect password", async () => {
    const login = {
      username: 'admin',
      password: 'bhulhuitre',
    };
    const result = await validateLogin(login);
    expect(result).toBe('Invalid username or password');
  });

  it("doesn't validate the user with incorrect username and password", async () => {
    const login = {
      username: 'Bhuvan',
      password: 'bhulhuitre',
    };
    const result = await validateLogin(login);
    expect(result).toBe('Invalid username or password');
  });
});
