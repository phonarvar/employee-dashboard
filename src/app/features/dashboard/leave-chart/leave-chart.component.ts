import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ChartComponent as ApexChartComponent,
} from 'ng-apexcharts';
import { LeaveRequestService } from '../../../core/leave-request.service';
import { LeaveRequest } from '../../../core/model';

@Component({
  selector: 'app-leave-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './leave-chart.component.html',
})
export class LeaveChartComponent implements OnInit {
  private leaveService = inject(LeaveRequestService);

  @ViewChild('chartObj') chartObj: ApexChartComponent | undefined; // Get Chart Component Reference

  series: ApexAxisChartSeries = [];
  chart: ApexChart = {
    type: 'bar',
    height: 350,
  };
  xaxis: ApexXAxis = {
    categories: [],
    type: 'category', // Ensure category type
  };

  ngOnInit(): void {
    this.leaveService.getLeaves().subscribe((leaves: LeaveRequest[]) => {
      const monthlyCounts: Record<string, number> = {};

      for (const leave of leaves) {
        const date = new Date(leave.createdAt);
        const month = date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      }

      this.xaxis.categories = Object.keys(monthlyCounts);
      this.series = [
        {
          name: 'Leave Requests',
          data: Object.values(monthlyCounts),
        },
      ];

      // Force Chart to Re-render after async data load
      setTimeout(() => {
        this.chartObj?.updateOptions({
          xaxis: this.xaxis,
          series: this.series,
        });
      });
    });
  }
}
