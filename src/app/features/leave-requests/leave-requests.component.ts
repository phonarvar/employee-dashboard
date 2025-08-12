import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';
import { LeaveRequestService } from '../../core/leave-request.service';
import { EmployeeService } from '../employees/employees.service';
import { LeaveRequest } from '../../core/model';
import { Employee } from '../employees/employee.model';
import { AuthService } from '../../core/auth-service.service';
import defaultEmployees from '../employees/default-employees';
import defaultLeaveRequests from '../employees/default-leave-requests';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss'],
})
export class LeaveRequestsComponent implements OnInit {
  leaveRequests: LeaveRequest[] = [];
  employeesMap = new Map<string, Employee>();
  loading = false;
  actionLoading = new Set<string>();
  restoreLoading = false;

  constructor(
    private leaveRequestService: LeaveRequestService,
    private employeeService: EmployeeService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.loading = true;
    forkJoin({
      leaves: this.leaveRequestService.getLeaves(),
      employees: this.employeeService.getEmployees(),
    }).subscribe({
      next: ({ leaves, employees }) => {
        this.leaveRequests = leaves.sort((a, b) => Number(a.id) - Number(b.id));
        this.employeesMap.clear();
        employees.forEach((emp) => this.employeesMap.set(emp.id, emp));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed loading leaves/employees:', err);
        this.loading = false;
      },
    });
  }

  approveLeave(request: LeaveRequest): void {
    if (!request?.id || !request.employeeId) return;
    if (this.actionLoading.has(request.id)) return;
    this.actionLoading.add(request.id);

    this.leaveRequestService
      .updateLeaveStatus(request.id, 'approved')
      .pipe(
        switchMap(() =>
          this.employeeService.deleteEmployee(request.employeeId).pipe(
            catchError((err) => {
              console.warn(
                `Failed deleting employee ${request.employeeId}`,
                err
              );
              return of(null);
            })
          )
        ),
        finalize(() => this.actionLoading.delete(request.id))
      )
      .subscribe(() => {
        this.leaveRequests = this.leaveRequests.filter(
          (r) => r.id !== request.id
        );
        this.employeesMap.delete(request.employeeId);
      });
  }

  rejectLeave(request: LeaveRequest): void {
    if (!request?.id) return;
    if (this.actionLoading.has(request.id)) return;
    this.actionLoading.add(request.id);

    this.leaveRequestService
      .updateLeaveStatus(request.id, 'rejected')
      .pipe(finalize(() => this.actionLoading.delete(request.id)))
      .subscribe(() => {
        this.leaveRequests = this.leaveRequests.filter(
          (r) => r.id !== request.id
        );
      });
  }

  async restoreDefaults(): Promise<void> {
    if (
      !confirm(
        'This will delete all employees and leave requests, then restore defaults. Continue?'
      )
    )
      return;
    if (this.restoreLoading) return;
    this.restoreLoading = true;

    try {
      // 1) Fetch current employees and delete them one-by-one
      const currentEmployees = await lastValueFrom(
        this.employeeService.getEmployees()
      );
      for (const e of currentEmployees || []) {
        try {
          await lastValueFrom(this.employeeService.deleteEmployee(e.id));
        } catch (err) {
          console.warn('deleteEmployee failed for', e.id, err);
          // continue deleting others
        }
        // small pause to help flaky mock backends settle
        await new Promise((res) => setTimeout(res, 60));
      }

      // 2) Fetch current leaves and delete them one by one
      const currentLeaves = await lastValueFrom(
        this.leaveRequestService.getLeaves()
      );
      for (const l of currentLeaves || []) {
        try {
          await lastValueFrom(this.leaveRequestService.deleteLeave(l.id));
        } catch (err) {
          console.warn('deleteLeave failed for', l.id, err);
        }
        await new Promise((res) => setTimeout(res, 40));
      }

      // 3) Create default employees sequentially and build origId -> newBackendId map
      const origToNew = new Map<string, string>();
      for (const defEmp of defaultEmployees) {
        // remove id from payload so backend assigns a fresh ID
        const { id: origId, ...payload } = defEmp as any;
        try {
          const created = await lastValueFrom(
            this.employeeService.addEmployee(payload)
          );
          if (created && (created as any).id) {
            origToNew.set(String(origId), String((created as any).id));
          } else {
            // fallback: try to match by name later
            console.warn('employee create returned no id for', defEmp);
          }
        } catch (err) {
          console.error('Failed to create default employee', defEmp, err);
        }
        await new Promise((res) => setTimeout(res, 80));
      }

      // 4) Re-fetch employees to be 100% sure and fill missing mapping by name
      const refreshed = await lastValueFrom(
        this.employeeService.getEmployees()
      );
      for (const emp of refreshed) {
        // if some original ids didn't map (returned null earlier), match by name
        if (![...origToNew.values()].includes(String(emp.id))) {
          const orig = defaultEmployees.find((d) => d.name === emp.name);
          if (orig) origToNew.set(String(orig.id), String(emp.id));
        }
      }

      // 5) Create default leave requests remapped to new backend employee IDs
      for (const defLeave of defaultLeaveRequests) {
        // remove id so backend assigns it
        const { id: leaveId, ...leavePayload } = defLeave as any;
        const mappedEmpId =
          origToNew.get(String(defLeave.employeeId)) ??
          String(defLeave.employeeId);
        const payload = { ...leavePayload, employeeId: mappedEmpId };
        try {
          await lastValueFrom(
            this.leaveRequestService.createLeaveRequest(payload)
          );
        } catch (err) {
          console.error('Failed creating default leave request', defLeave, err);
        }
        await new Promise((res) => setTimeout(res, 40));
      }

      // 6) final refresh in UI, all for mocked data, a lot of useless work
      await this.loadData();
      alert('Defaults restored successfully.');
    } catch (err) {
      console.error('restoreDefaults failed overall:', err);
      alert('Restore failed — see console for details.');
    } finally {
      this.restoreLoading = false;
    }
  }

  getEmployeeName(id: string): string {
    return this.employeesMap.get(id)?.name ?? 'Unknown';
  }

  trackByRequestId(_: number, item: LeaveRequest) {
    return item.id;
  }

  isActionLoading(leaveId: string): boolean {
    return this.actionLoading.has(leaveId);
  }
}
