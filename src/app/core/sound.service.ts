import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {
  private soundEnabled = signal<boolean>(true); // Default: enabled

  private clickAudio = new Audio('assets/sounds/click.mp3'); // temp/I'll add this file later

  enableSound(enabled: boolean) {
    //control from outside
    this.soundEnabled.set(enabled);
  }

  isSoundEnabled() {
    //readonly access
    return this.soundEnabled.asReadonly();
  }

  playClick() {
    if (this.soundEnabled()) {
      this.clickAudio.currentTime = 0;
      this.clickAudio.play();
    }
  }
}
