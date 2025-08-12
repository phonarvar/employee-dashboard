import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from './employees.service';
import { Employee } from './employee.model';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { EmployeeItemComponent } from './employee-item/employee-item.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component'; //remember to remove form comp
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HoverHighlightDirective } from '../../shared/directives/hover-highlight.directive';
import { IfUserIsAdminDirective } from '../../shared/directives/if-user-is-admin.directive';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { AuthService } from '../../core/auth-service.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPipe, // pipe still used, now in HTML
    EmployeeItemComponent,
    HoverHighlightDirective,
    RouterLink,
    IfUserIsAdminDirective,
    SpinnerComponent,
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';
  loading = true;
  isAdmin = false;

  // Pagination variables
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.route.queryParamMap.subscribe((params) => {
      const status = params.get('status');

      this.employeeService.getEmployees().subscribe((allEmployees) => {
        let filtered = allEmployees;
        if (status === 'active' || status === 'inactive') {
          filtered = allEmployees.filter((emp) => emp.status === status);
        }

        this.employees = filtered;
        this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        this.loading = false;
      });
    });
  }

  // pagination now slices after filtering in template
  getPaginated(filtered: Employee[]): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  filterByStatus(status: string) {
    this.loading = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status },
      queryParamsHandling: 'merge',
    });
  }

  clearStatusFilter() {
    this.loading = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: null },
      queryParamsHandling: 'merge',
    });
  }
}
