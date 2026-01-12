import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Track } from '../../src/lib/music-player/types';

interface HowlOptions {
  src: string[];
  html5: boolean;
  onplay?: () => void;
  onpause?: () => void;
  onstop?: () => void;
  onend?: () => void;
  onload?: () => void;
}

class MockHowl {
  private options: HowlOptions;
  private seekValue = 0;

  constructor(options: HowlOptions) {
    this.options = options;
    setTimeout(() => this.options.onload?.(), 0);
  }

  play() {
    this.options.onplay?.();
  }

  pause() {
    this.options.onpause?.();
  }

  stop() {
    this.options.onstop?.();
  }

  unload() {}

  seek(val?: number): number {
    if (val !== undefined) this.seekValue = val;
    return this.seekValue;
  }

  duration(): number {
    return 180;
  }

  triggerEnd() {
    this.options.onend?.();
  }
}

vi.mock('howler', () => ({
  Howl: MockHowl,
}));

const mockTracks: Track[] = [
  { src: '/track1.mp3', title: 'Track 1', info: 'Artist 1' },
  { src: '/track2.mp3', title: 'Track 2', info: 'Artist 2' },
  { src: '/track3.mp3', title: 'Track 3', info: 'Artist 3' },
];

describe('AudioEngine', () => {
  let AudioEngine: typeof import('../../src/lib/music-player/audio-engine').AudioEngine;
  let engine: InstanceType<typeof AudioEngine>;

  beforeEach(async () => {
    vi.useFakeTimers();
    const module = await import('../../src/lib/music-player/audio-engine');
    AudioEngine = module.AudioEngine;
    engine = new AudioEngine();
    engine.setTracks(mockTracks);
  });

  afterEach(() => {
    engine.destroy();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const state = engine.getState();
    expect(state.currentTrackIndex).toBe(-1);
    expect(state.isPlaying).toBe(false);
    expect(state.currentTime).toBe(0);
    expect(state.duration).toBe(0);
  });

  it('should load a track', () => {
    engine.loadTrack(0);
    const state = engine.getState();
    expect(state.currentTrackIndex).toBe(0);
  });

  it('should return current track', () => {
    engine.loadTrack(1);
    const track = engine.getCurrentTrack();
    expect(track).toEqual(mockTracks[1]);
  });

  it('should return null when no track loaded', () => {
    const track = engine.getCurrentTrack();
    expect(track).toBeNull();
  });

  it('should return track count', () => {
    expect(engine.getTrackCount()).toBe(3);
  });

  it('should not load invalid track index', () => {
    engine.loadTrack(-1);
    expect(engine.getState().currentTrackIndex).toBe(-1);

    engine.loadTrack(99);
    expect(engine.getState().currentTrackIndex).toBe(-1);
  });

  it('should toggle play/pause', () => {
    engine.loadTrack(0);
    expect(engine.getState().isPlaying).toBe(false);

    engine.play();
    expect(engine.getState().isPlaying).toBe(true);

    engine.pause();
    expect(engine.getState().isPlaying).toBe(false);

    engine.togglePlayPause();
    expect(engine.getState().isPlaying).toBe(true);

    engine.togglePlayPause();
    expect(engine.getState().isPlaying).toBe(false);
  });

  it('should call onUpdate callback', () => {
    const callback = vi.fn();
    engine.setOnUpdate(callback);
    engine.loadTrack(0);

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        currentTrackIndex: 0,
      })
    );
  });

  it('should seek to position', () => {
    engine.loadTrack(0);
    vi.runAllTimers();

    engine.seek(0.5);
    const state = engine.getState();
    expect(state.currentTime).toBe(90);
  });
});
