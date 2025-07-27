import { Injectable, computed, signal } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fakeUsers = [
    { email: 'admin@test.com', password: '123', role: 'admin' },
    { email: 'user@test.com', password: '123', role: 'user' },
  ];

  private _isLoggedIn = signal(false);
  private _isAdmin = signal(false);
  private _userId = signal<string | null>(null); //hardcoded temporary

  readonly isLoggedIn = computed(() => this._isLoggedIn());
  readonly isAdmin = computed(() => this._isLoggedIn() && this._isAdmin()); //value derived from more than one signal

  login(email: string, password: string): Observable<{ success: boolean }> {
    const user = this.fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      this._isLoggedIn.set(true);
      this._isAdmin.set(user.role === 'admin');
      this._userId.set(user.role === 'admin' ? 'admin-uid' : 'user-uid');
      return of({ success: true }); //returning obs instead of boolean true because http calls return obs as well
    }

    alert('Invalid credentials');
    return of({ success: false });
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._isAdmin.set(false);
    this._userId.set(null);
  }

  loggedInUserId() {
    return this._userId();
  }
}
