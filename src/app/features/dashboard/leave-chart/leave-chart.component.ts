import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule, // ApexCharts.js library
  ApexAxisChartSeries, // A type defining the structure of data series
  ApexChart, // A type representing chart configuration options like type, height, animations
  ApexXAxis, //A type for X-axis config
  ApexTooltip, // A type for tooltip config
  ApexYAxis, // A type for Y-axis config
  ChartComponent as ApexChartComponent, // renaming
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

  @ViewChild('chartObj') chartObj: ApexChartComponent | undefined; // Get Chart Component Reference, may not exist before view init

  series: ApexAxisChartSeries = []; // set of data points plotted on a chart, data is required, name is optional but always used
  chart: ApexChart = {
    // type ensures valid properties (type, height, animations)
    type: 'bar',
    height: 350, // entire chart container is 350 pixel tall
    foreColor: '#cccccc', // sets default font color for axis labels and legends, less bright for dark mode
  };
  xaxis: ApexXAxis = {
    // config for x-axis
    categories: [], // array of labels that appear under each bar
    type: 'category', // type tells ApexCharts how to interpret the X-axis, 'category' = Treat labels as text names
    labels: {
      style: {
        colors: '#cccccc', // less bright color for x-axis labels (dates) in dark mode
      }
    }
  }; // 'datetime' = treat as timestamp, 'number' = treat as numbers
  yaxis: ApexYAxis = {
    labels: {
      style: {
        colors: '#cccccc', // less bright color for y-axis labels (numbers) in dark mode
      }
    }
  };
  tooltip: ApexTooltip = {
    theme: 'dark', // dark theme tooltip
    style: {
      fontSize: '14px',
      colors: ['#cccccc'] // less bright color for tooltip text in dark mode
    } as any, // bypass TypeScript error for `colors`
  };

  ngOnInit(): void {
    this.leaveService.getLeaves().subscribe((leaves: LeaveRequest[]) => {
      const monthlyCounts: Record<string, number> = {}; // utility type describing objects with specific key-value

      for (const leave of leaves) {
        const date = new Date(leave.createdAt);
        const month = date.toLocaleString('default', {
          // .toLocaleString(locale, options), locale = language/country format, option = config object
          month: 'short', // common
          year: 'numeric', // common
        });
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1; // sets the values of monthlyCounts keys
      }

      this.xaxis.categories = Object.keys(monthlyCounts); //Sets  labels on the X-axis.
      this.series = [
        {
          name: 'Leave Requests', // This is the label for the series, appears as legend on each bar
          data: Object.values(monthlyCounts), // bar height or datapoint
        },
      ];

      // Forcing/tricking Chart to Re-render, after ngOnInit, the view is not fully rendered or even apexchart engine might not be ready
      // It's better to use ngAfterViewInit with changeDetectionRef but I'll leave it be for now
      setTimeout(() => {
        this.chartObj?.updateOptions({ // A method provided by the ApexChartComponent
          xaxis: this.xaxis,
          yaxis: this.yaxis,
          tooltip: this.tooltip,
          series: this.series,
        });
      });
    });
  }
}