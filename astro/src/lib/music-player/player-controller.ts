import { AudioEngine } from './audio-engine';
import type { Track, PlayerState, PlayerElements } from './types';

export class PlayerController {
  private engine: AudioEngine;
  private elements: PlayerElements | null = null;

  constructor() {
    this.engine = new AudioEngine();
  }

  init(container: HTMLElement): void {
    const elements = this.queryElements(container);
    if (!elements) return;

    this.elements = elements;
    const tracks = this.extractTracks(elements.trackItems);
    this.engine.setTracks(tracks);

    this.engine.setOnUpdate((state) => this.updateUI(state));
    this.engine.setOnTrackEnd(() => this.handleTrackEnd());

    this.bindEvents();
  }

  destroy(): void {
    this.engine.destroy();
    this.elements = null;
  }

  private queryElements(container: HTMLElement): PlayerElements | null {
    const playButton = container.querySelector<HTMLButtonElement>('#playButton');
    const prevButton = container.querySelector<HTMLButtonElement>('#prevButton');
    const nextButton = container.querySelector<HTMLButtonElement>('#nextButton');
    const downloadButton = container.querySelector<HTMLButtonElement>('#downloadButton');
    const progressBar = container.querySelector<HTMLElement>('#progressBar');
    const progress = container.querySelector<HTMLElement>('#progress');
    const timeDisplay = container.querySelector<HTMLElement>('#timeDisplay');
    const trackItems = container.querySelectorAll<HTMLElement>('.track-item');

    if (!playButton || !prevButton || !nextButton || !downloadButton ||
        !progressBar || !progress || !timeDisplay || !trackItems.length) {
      return null;
    }

    return {
      playButton,
      prevButton,
      nextButton,
      downloadButton,
      progressBar,
      progress,
      timeDisplay,
      trackItems,
    };
  }

  private extractTracks(trackItems: NodeListOf<HTMLElement>): Track[] {
    return Array.from(trackItems).map((item) => ({
      src: item.dataset.src ?? '',
      title: item.dataset.title ?? '',
      info: item.dataset.info ?? '',
    }));
  }

  private bindEvents(): void {
    if (!this.elements) return;

    this.elements.playButton.addEventListener('click', () => this.handlePlayClick());
    this.elements.prevButton.addEventListener('click', () => this.handlePrevClick());
    this.elements.nextButton.addEventListener('click', () => this.handleNextClick());
    this.elements.downloadButton.addEventListener('click', () => this.handleDownloadClick());
    this.elements.progressBar.addEventListener('click', (e) => this.handleProgressClick(e));

    this.elements.trackItems.forEach((item, index) => {
      item.addEventListener('click', () => this.handleTrackClick(index));
    });
  }

  private handlePlayClick(): void {
    const state = this.engine.getState();
    if (state.currentTrackIndex === -1) {
      this.engine.loadTrack(0);
      this.engine.play();
    } else {
      this.engine.togglePlayPause();
    }
  }

  private handlePrevClick(): void {
    const state = this.engine.getState();
    if (state.currentTrackIndex > 0) {
      this.engine.loadTrack(state.currentTrackIndex - 1);
    }
  }

  private handleNextClick(): void {
    const state = this.engine.getState();
    if (state.currentTrackIndex < this.engine.getTrackCount() - 1) {
      this.engine.loadTrack(state.currentTrackIndex + 1);
    }
  }

  private handleDownloadClick(): void {
    const track = this.engine.getCurrentTrack();
    if (!track) return;

    const a = document.createElement('a');
    a.href = track.src;
    a.download = `${track.info} ${track.title}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private handleProgressClick(e: MouseEvent): void {
    if (!this.elements) return;
    const rect = this.elements.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.engine.seek(Math.max(0, Math.min(1, percent)));
  }

  private handleTrackClick(index: number): void {
    this.engine.loadTrack(index);
    this.engine.play();
  }

  private handleTrackEnd(): void {
    const state = this.engine.getState();
    if (state.currentTrackIndex < this.engine.getTrackCount() - 1) {
      this.engine.loadTrack(state.currentTrackIndex + 1);
      this.engine.play();
    }
  }

  private updateUI(state: PlayerState): void {
    if (!this.elements) return;

    this.updatePlayPauseIcon(state.isPlaying);
    this.updateProgress(state.currentTime, state.duration);
    this.updateTimeDisplay(state.currentTime, state.duration);
    this.updateActiveTrack(state.currentTrackIndex);
    this.updateNavigationButtons(state.currentTrackIndex);
  }

  private updatePlayPauseIcon(isPlaying: boolean): void {
    if (!this.elements) return;
    const playIcon = this.elements.playButton.querySelector('.play-icon');
    const pauseIcon = this.elements.playButton.querySelector('.pause-icon');
    playIcon?.classList.toggle('hidden', isPlaying);
    pauseIcon?.classList.toggle('hidden', !isPlaying);
  }

  private updateProgress(currentTime: number, duration: number): void {
    if (!this.elements || !duration) return;
    const percent = (currentTime / duration) * 100;
    this.elements.progress.style.width = `${percent}%`;
  }

  private updateTimeDisplay(currentTime: number, duration: number): void {
    if (!this.elements) return;
    this.elements.timeDisplay.textContent =
      `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
  }

  private updateActiveTrack(index: number): void {
    if (!this.elements) return;
    this.elements.trackItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  private updateNavigationButtons(index: number): void {
    if (!this.elements) return;
    const trackCount = this.engine.getTrackCount();
    this.elements.prevButton.disabled = index <= 0;
    this.elements.nextButton.disabled = index >= trackCount - 1 || index < 0;
    this.elements.downloadButton.disabled = index < 0;
  }

  private formatTime(seconds: number): string {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
