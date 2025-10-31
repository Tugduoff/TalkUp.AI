import { describe, expect, it } from 'vitest';

import { formatTime } from '../src/utils/time';

describe('formatTime', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(600 + 9)).toBe('10:09');
  });
});
