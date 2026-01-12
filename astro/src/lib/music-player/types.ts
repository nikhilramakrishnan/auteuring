export interface Track {
  src: string;
  title: string;
  info: string;
}

export interface PlayerState {
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface PlayerElements {
  playButton: HTMLButtonElement;
  prevButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  downloadButton: HTMLButtonElement;
  progressBar: HTMLElement;
  progress: HTMLElement;
  timeDisplay: HTMLElement;
  trackItems: NodeListOf<HTMLElement>;
}
