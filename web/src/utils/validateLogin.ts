/**
 * Validates user login credentials.
 * 
 * This function checks if the provided username and password match the hardcoded values.
 * It simulates an asynchronous validation process by returning a Promise that resolves after a short delay.
 * 
 * @param login - The login credentials object
 * @param login.username - The username to validate
 * @param login.password - The password to validate
 * @returns A Promise that resolves to either:
 *   - `undefined` if the credentials are valid (username and password both equal "admin")
 *   - An error message string "Invalid username or password" if the credentials are invalid
 * 
 * @example
 * // Example of valid login
 * validateLogin({ username: 'admin', password: 'admin' })
 *   .then(error => {
 *     if (!error) console.log('Login successful');
 *   });
 * 
 * // Example of invalid login
 * validateLogin({ username: 'user', password: 'wrong' })
 *   .then(error => {
 *     if (error) console.log(error); // "Invalid username or password"
 *   });
 */
export const validateLogin = async (login: {
  username: string;
  password: string;
}) => {
  return new Promise<string | undefined>((resolve) => {
    setTimeout(() => {
      if (login.username === 'admin' && login.password === 'admin') {
        resolve(undefined);
      } else {
        resolve('Invalid username or password');
      }
    }, 100);
  });
};
