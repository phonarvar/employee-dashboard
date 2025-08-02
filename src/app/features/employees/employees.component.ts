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

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPipe, //no longer used, look at it later
    EmployeeItemComponent,
    HoverHighlightDirective,
    RouterLink,
    IfUserIsAdminDirective,
    SpinnerComponent
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';
  loading = true;

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const status = params.get('status');

      this.employeeService
        .getEmployees()
        .subscribe((allEmployees: Employee[]) => {
          if (status === 'active' || status === 'inactive') {
            this.employees = allEmployees.filter(
              (emp: Employee) => emp.status === status
            );
          } else {
            this.employees = allEmployees;
          }
          this.loading = false; //hide spinner after loading
        });
    });
  }

  filterByStatus(status: string) {
    this.loading = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status },
      queryParamsHandling: 'merge', // merge with other params like searchTerm if added later
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
