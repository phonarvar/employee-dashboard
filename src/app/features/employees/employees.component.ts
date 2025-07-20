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

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FilterPipe,
    EmployeeItemComponent,
    EmployeeFormComponent, //no longer needed for now, remove later
    HoverHighlightDirective,
    RouterLink,
    IfUserIsAdminDirective,
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const status = params.get('status');
      const allEmployees = this.employeeService.getEmployees();

      if (status === 'active' || status === 'inactive') {
        this.employees = allEmployees.filter((emp) => emp.status === status);
      } else {
        this.employees = allEmployees;
      }
    });
  }

  filterByStatus(status: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status },
      queryParamsHandling: 'merge', // merge with other params like searchTerm if added later
    });
  }

  clearStatusFilter() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: null },
      queryParamsHandling: 'merge',
    });
  }
}
