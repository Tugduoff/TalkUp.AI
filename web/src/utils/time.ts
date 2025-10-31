/**
 * Formats the elapsed time (in seconds) into the MM:SS string format.
 * @param {number} time - The elapsed time in seconds.
 * @returns {string} The formatted time ('MM:SS').
 */
export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
