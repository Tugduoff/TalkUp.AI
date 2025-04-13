export const validateUsername = async (username: string) => {
  return new Promise<string | undefined>((resolve) => {
    setTimeout(() => {
      resolve(["admin", "user", "test"].includes(username)
        ? "Username already exists"
        : undefined);
    }, 100);
  });
};
