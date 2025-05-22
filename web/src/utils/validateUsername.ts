/**
 * Asynchronously validates a username.
 *
 * This function checks if a given username already exists in a predefined list.
 * It simulates an asynchronous operation with a timeout of 100ms.
 *
 * @param username - The username to validate
 * @returns A Promise that resolves to a string with an error message if the username exists,
 *          or undefined if the username is available
 *
 * @example
 * // Check if a username is available
 * const error = await validateUsername('newUser');
 * if (error) {
 *   console.error(error);
 * } else {
 *   console.log('Username is available');
 * }
 */
export const validateUsername = async (username: string) => {
  return new Promise<string | undefined>((resolve) => {
    setTimeout(() => {
      resolve(
        ['admin', 'user', 'test'].includes(username)
          ? 'Username already exists'
          : undefined,
      );
    }, 100);
  });
};
