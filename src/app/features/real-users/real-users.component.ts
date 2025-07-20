import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealApiService } from '../../core/real-api.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-real-users',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './real-users.component.html',
  styleUrls: ['./real-users.component.scss'],
})
export class RealUsersComponent implements OnInit {
  private realApi = inject(RealApiService);
  users: any[] = [];
  loading = true;

  ngOnInit() {
    this.realApi.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
