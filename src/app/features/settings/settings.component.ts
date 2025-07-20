import { Component } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { ThemeService } from '../../core/theme.service';
import { SoundToggleComponent } from './sound-toggle/sound-toggle.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ThemeToggleComponent, SoundToggleComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  constructor(private themeService: ThemeService) {}
  onThemeChange(isDark: boolean) {
    this.themeService.setDarkMode(isDark);
  }
  onSoundChange(isSoundOn: boolean) {
    console.log('Sound is now:', isSoundOn ? 'ON' : 'OFF'); //temporary, no use for it now other than logging
  }
}
