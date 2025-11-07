import { describe, expect, it } from 'vitest';

import { formatTime } from './time';

describe('formatTime', () => {
  it('formats seconds to HH:MM:SS', () => {
    expect(formatTime(0)).toBe('00:00:00');
    expect(formatTime(5)).toBe('00:00:05');
    expect(formatTime(65)).toBe('00:01:05');
    expect(formatTime(600 + 9)).toBe('00:10:09');
  });
});
