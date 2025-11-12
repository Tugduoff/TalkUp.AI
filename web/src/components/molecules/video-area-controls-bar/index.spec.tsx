import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import VideoAreaControlsBar from './index';

describe('VideoAreaControlsBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders controls with correct aria-labels based on props', () => {
    const noop = vi.fn();

    render(
      <VideoAreaControlsBar
        toggleStream={noop}
        isStreaming={false}
        isMicActive={true}
        isSpeakerActive={true}
        isCameraActive={true}
        toggleMic={noop}
        toggleSpeaker={noop}
        toggleCamera={noop}
      />,
    );

    // Speaker button should show 'Mute speaker' when active
    expect(
      screen.getByRole('button', { name: /Mute speaker/i }),
    ).toBeInTheDocument();

    // Stream button should show 'Start new call' when not streaming
    expect(
      screen.getByRole('button', { name: /Start new call/i }),
    ).toBeInTheDocument();

    // Camera button should show 'Turn off camera' when active
    expect(
      screen.getByRole('button', { name: /Turn off camera/i }),
    ).toBeInTheDocument();

    // Mic button should show 'Mute microphone' when active
    expect(
      screen.getByRole('button', { name: /Mute microphone/i }),
    ).toBeInTheDocument();
  });

  it('calls provided handlers when buttons are clicked', () => {
    const toggleStream = vi.fn();
    const toggleMic = vi.fn();
    const toggleSpeaker = vi.fn();
    const toggleCamera = vi.fn();

    render(
      <VideoAreaControlsBar
        toggleStream={toggleStream}
        isStreaming={true}
        isMicActive={false}
        isSpeakerActive={false}
        isCameraActive={false}
        toggleMic={toggleMic}
        toggleSpeaker={toggleSpeaker}
        toggleCamera={toggleCamera}
      />,
    );

    // Buttons by aria-label
    fireEvent.click(screen.getByRole('button', { name: /End call/i }));
    expect(toggleStream).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Unmute speaker/i }));
    expect(toggleSpeaker).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Turn on camera/i }));
    expect(toggleCamera).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Unmute microphone/i }));
    expect(toggleMic).toHaveBeenCalled();
  });
});
