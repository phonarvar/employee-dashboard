import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/auth-service.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public notificationsService = inject(NotificationService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isPanelOpen = signal(false);

  togglePanel() {
    this.isPanelOpen.update((v) => !v);
  }

  closePanel() {
    this.isPanelOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
