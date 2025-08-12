import {
  Component,
  computed,
  inject,
  signal,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  Router,
  RouterModule,
  NavigationStart,
} from '@angular/router';
import { AuthService } from '../../core/auth-service.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  public notificationsService = inject(NotificationService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  isPanelOpen = signal(false);

  // New signals for pinning + hovering state
  private isPinned = signal(false);
  private isHovering = signal(false);

  // ViewChild to detect outside clicks
  @ViewChild('notificationIcon', { read: ElementRef, static: false })
  notificationIconRef!: ElementRef<HTMLElement>;

  // save listeners/subscriptions so we can clean them up
  private docClickListener = (e: MouseEvent) => this.onDocumentClick(e);
  private keydownListener = (e: KeyboardEvent) => this.onDocumentKeydown(e);
  private routerSub: Subscription | null = null;

  // Public getters used in templates, can use direct calls as well .()
  panelOpen() {
    return this.isPanelOpen();
  }

  panelPinned() {
    return this.isPinned();
  }

  constructor() {}

  ngAfterViewInit() {
    // Attach document-level listeners
    document.addEventListener('click', this.docClickListener, true);
    document.addEventListener('keydown', this.keydownListener, true);

    // Close panel on route navigation (navigating away)
    this.routerSub = this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        this.closeAndUnpin();
      }
    });
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.docClickListener, true);
    document.removeEventListener('keydown', this.keydownListener, true);
    this.routerSub?.unsubscribe();
  }

  // Called by (mouseenter) on the icon element
  onMouseEnter() {
    this.isHovering.set(true);
    this.isPanelOpen.set(true);
    // hover should not pin
  }

  // Called by (mouseleave) on the icon element
  onMouseLeave() {
    this.isHovering.set(false);
    // Only close when NOT pinned
    if (!this.isPinned()) {
      this.isPanelOpen.set(false);
    }
  }

  // Called by (click) on the icon element
  // Click toggles pin state. When pinned we force the panel open.
  // When unpinned we allow hover behavior to control closing.
  onClickTogglePin(event?: MouseEvent) {
    // prevent the document click handler from immediately treating this as an outside click
    if (event) {
      event.stopPropagation();
    }

    const newPinned = !this.isPinned();
    this.isPinned.set(newPinned);

    if (newPinned) {
      // pin: ensure panel stays open
      this.isPanelOpen.set(true);
    } else {
      // unpin: if mouse isn't over it, close immediately, else keep open (hover will control)
      if (!this.isHovering()) {
        this.isPanelOpen.set(false);
      }
    }
  }

  // Close panel and clear pinned state (used for outside-click, Escape, navigation)
  private closeAndUnpin() {
    this.isPinned.set(false);
    this.isPanelOpen.set(false);
  }

  // Document click handler: if click is outside notificationIconRef, close & unpin
  private onDocumentClick(ev: MouseEvent) {
    // If panel isn't open, nothing to do
    if (!this.isPanelOpen()) {
      return;
    }

    // If we don't yet have the ref (component might not be initialized), bail out
    const el = this.notificationIconRef?.nativeElement;
    if (!el) {
      return;
    }

    // If clicked element is inside the notification icon element, do nothing
    if (el.contains(ev.target as Node)) {
      return;
    }

    // Clicked outside -> close and unpin
    this.closeAndUnpin();
  }

  // Escape key closes and unpins
  private onDocumentKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      if (this.isPanelOpen()) {
        this.closeAndUnpin();
      }
    }
  }

  // Existing helpers
  togglePanel() {
    // Keeping this for compatibility in case other code that calls togglePanel()
    // treat togglePanel as a simple toggle that does NOT change pinned state.
    this.isPanelOpen.update((v) => !v);
    // Respect pin: if panel becomes closed, clear pinned; if becomes open, do not pin.
    if (!this.isPanelOpen()) {
      this.isPinned.set(false);
    }
  }

  // Explicit close (keeps pinned cleared)
  closePanel() {
    this.isPanelOpen.set(false);
    this.isPinned.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
}
