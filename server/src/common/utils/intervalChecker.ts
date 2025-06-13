/**
 * Utility function to check if a given date is late based on the current date and a specified expiration duration.
 * @param dateToCheck Date to check against the current date
 * @param expiresIn Duration in seconds after which the date is considered late
 * @returns boolean indicating if the date is late
 */
export const isDateLate = (dateToCheck: Date, expiresIn: string): boolean => {
  if (!dateToCheck || !expiresIn) {
    throw new Error("Both dateToCheck and expiresIn are required");
  }

  const expirationDate = new Date(dateToCheck);
  expirationDate.setSeconds(
    expirationDate.getSeconds() + parseInt(expiresIn, 10),
  );

  return expirationDate < new Date();
};
