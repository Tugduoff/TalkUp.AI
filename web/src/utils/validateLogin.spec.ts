import { describe, expect, it } from 'vitest';

import { validateLogin } from './validateLogin';

describe('Validate Login Implementation', () => {
  it('successfully validates the user', async () => {
    const login = {
      email: 'admin.admin@admin.com',
      password: 'admin',
    };
    const result = await validateLogin(login);
    expect(result).toBeUndefined();
  });

  it("doesn't validate the user with incorrect email", async () => {
    const login = {
      email: 'Bhuvan',
      password: 'admin',
    };
    const result = await validateLogin(login);
    expect(result).toBe('Invalid email or password');
  });

  it("doesn't validate the user with incorrect password", async () => {
    const login = {
      email: 'admin',
      password: 'bhulhuitre',
    };
    const result = await validateLogin(login);
    expect(result).toBe('Invalid email or password');
  });

  it("doesn't validate the user with incorrect email and password", async () => {
    const login = {
      email: 'Bhuvan',
      password: 'bhulhuitre',
    };
    const result = await validateLogin(login);
    expect(result).toBe('Invalid email or password');
  });
});
