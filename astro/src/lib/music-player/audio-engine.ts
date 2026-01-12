import { Howl } from 'howler';
import type { Track, PlayerState } from './types';

export type AudioEngineCallback = (state: PlayerState) => void;

export class AudioEngine {
  private howl: Howl | null = null;
  private tracks: Track[] = [];
  private state: PlayerState = {
    currentTrackIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  };
  private onUpdate: AudioEngineCallback | null = null;
  private onTrackEnd: (() => void) | null = null;
  private rafId: number | null = null;

  setTracks(tracks: Track[]): void {
    this.tracks = tracks;
  }

  setOnUpdate(callback: AudioEngineCallback): void {
    this.onUpdate = callback;
  }

  setOnTrackEnd(callback: () => void): void {
    this.onTrackEnd = callback;
  }

  loadTrack(index: number): void {
    if (index < 0 || index >= this.tracks.length) return;

    const wasPlaying = this.state.isPlaying;
    this.stop();

    const track = this.tracks[index];
    this.howl = new Howl({
      src: [track.src],
      html5: true,
      onplay: () => this.startProgressLoop(),
      onpause: () => this.stopProgressLoop(),
      onstop: () => this.stopProgressLoop(),
      onend: () => {
        this.state.isPlaying = false;
        this.stopProgressLoop();
        this.notifyUpdate();
        this.onTrackEnd?.();
      },
      onload: () => {
        this.state.duration = this.howl?.duration() ?? 0;
        this.notifyUpdate();
      },
    });

    this.state.currentTrackIndex = index;
    this.state.currentTime = 0;
    this.state.duration = 0;

    if (wasPlaying) {
      this.play();
    } else {
      this.notifyUpdate();
    }
  }

  play(): void {
    if (!this.howl) return;
    this.howl.play();
    this.state.isPlaying = true;
    this.notifyUpdate();
  }

  pause(): void {
    if (!this.howl) return;
    this.howl.pause();
    this.state.isPlaying = false;
    this.notifyUpdate();
  }

  stop(): void {
    if (this.howl) {
      this.howl.stop();
      this.howl.unload();
      this.howl = null;
    }
    this.state.isPlaying = false;
    this.stopProgressLoop();
  }

  togglePlayPause(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(percent: number): void {
    if (!this.howl || !this.state.duration) return;
    const time = percent * this.state.duration;
    this.howl.seek(time);
    this.state.currentTime = time;
    this.notifyUpdate();
  }

  getState(): PlayerState {
    return { ...this.state };
  }

  getCurrentTrack(): Track | null {
    if (this.state.currentTrackIndex < 0) return null;
    return this.tracks[this.state.currentTrackIndex] ?? null;
  }

  getTrackCount(): number {
    return this.tracks.length;
  }

  destroy(): void {
    this.stop();
    this.onUpdate = null;
    this.onTrackEnd = null;
  }

  private startProgressLoop(): void {
    this.stopProgressLoop();
    const update = () => {
      if (this.howl && this.state.isPlaying) {
        this.state.currentTime = this.howl.seek() as number;
        this.state.duration = this.howl.duration();
        this.notifyUpdate();
        this.rafId = requestAnimationFrame(update);
      }
    };
    this.rafId = requestAnimationFrame(update);
  }

  private stopProgressLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private notifyUpdate(): void {
    this.onUpdate?.(this.getState());
  }
}
