export const validateLogin = async (login: { username: string, password: string }) => {
  return new Promise<string | undefined>((resolve) => {
    setTimeout(() => {
      if (login.username === "admin" && login.password === "admin") {
        resolve(undefined);
      } else {
        resolve("Invalid username or password");
      }
    }, 100);
  });
};
