import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error("Password is required");
  }

  try {
    // eslint-disable-next-line
    const hash: string = await bcrypt.hash(password, 10);

    return hash;
  } catch (err) {
    throw new Error(
      `Failed to hash password: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
};
