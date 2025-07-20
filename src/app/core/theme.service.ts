import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkMode = signal(false);

  isDarkMode = this.darkMode.asReadonly();

  setDarkMode(isDark: boolean): void {
    this.darkMode.set(isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
