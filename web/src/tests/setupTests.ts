import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

// JSDOM does not implement HTMLMediaElement.prototype.play which causes a noisy
// "Not implemented" warning during tests. Stub it to a no-op Promise so tests
// that call play() do not print the warning.
if (typeof HTMLMediaElement !== 'undefined') {
  const proto: any = HTMLMediaElement.prototype as any;
  if (!proto.play || !proto.play.__isStub) {
    try {
      if (!proto.play.__isStub) proto._originalPlay = proto.play;
    } catch {}
    // @ts-ignore
    proto.play = function () {
      return Promise.resolve();
    };
    proto.play.__isStub = true;
  }
}
