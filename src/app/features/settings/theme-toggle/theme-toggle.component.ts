import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SoundService } from '../../../core/sound.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  isDarkMode: boolean = false;
  @Output() themeChange = new EventEmitter<boolean>();
  private soundService = inject(SoundService);

  ngOnInit() {
    // 🛠 Sync the UI with <body> class on init
    this.isDarkMode = document.body.classList.contains('dark-mode'); //Can be done with signals more efficiently

    // contains checks if 'dark-mode' is one of the classes on <body>
    // returns true or false
    //common way for Syncing the UI toggle with the actual theme.
    //because we toggle it here, we add this to ngOnInit to run the logic on comp's initialization
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeChange.emit(this.isDarkMode);
    this.soundService.playClick(); ////angular.json isn't set up to serve it, must be configured like mock json data
  }
}
