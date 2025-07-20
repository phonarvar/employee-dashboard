import { Component, EventEmitter, Output, inject, Signal } from '@angular/core';
import { SoundService } from '../../../core/sound.service';

@Component({
  selector: 'app-sound-toggle',
  standalone: true,
  templateUrl: './sound-toggle.component.html',
  styleUrls: ['./sound-toggle.component.scss'],
})
export class SoundToggleComponent {
  @Output() soundChange = new EventEmitter<boolean>();

  private soundService = inject(SoundService); //instead of constructor
  isSoundOn = true;

  toggleSound() {
    this.isSoundOn = !this.isSoundOn;
    this.soundChange.emit(this.isSoundOn);
    this.soundService.enableSound(this.isSoundOn);
    this.soundService.playClick(); //angular.json isn't set up to serve it, must be configured like mock json data
  }
}
