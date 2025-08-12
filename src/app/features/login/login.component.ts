import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');

      this.authService.login(email, password).subscribe((result) => {
        if (result.success) {
          const isAdmin = this.authService.isAdmin();

          if (redirectTo) {
            // Only apply special leave request redirect if path starts with /leave-requests
            if (redirectTo.startsWith('/leave-requests')) {
              this.router.navigate(
                isAdmin ? ['/leave-requests'] : ['/leave-requests/form']
              );
              return;
            }

            // Otherwise just go back to the original route
            this.router.navigate([redirectTo]);
            return;
          }

          // Default landing page after login if no redirect
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }
}
