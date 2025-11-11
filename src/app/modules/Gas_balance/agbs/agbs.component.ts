import { Component, OnInit } from '@angular/core';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexFill,
  ApexStroke,
  ApexLegend,
  ApexTooltip
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  colors: string[];
  plotOptions: ApexPlotOptions;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-agbs',
  templateUrl: './agbs.component.html',
  styleUrls: ['./agbs.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class AgbsComponent implements OnInit {

  public agbsChart: ChartOptions;
  public cgbsChart: ChartOptions;


  constructor() {

    // AGBS chart
    this.agbsChart = {
      series: [
        { name: 'AGBS', data: [100, 500, 0.2, 6.0] }
      ],
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        foreColor: '#000',
        animations: { enabled: false },
        parentHeightOffset: 30 // 👈 gives extra space at bottom
      },

      colors: ['#3498DB'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 6
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toString(),
        style: { colors: ['#000'], fontWeight: 'bold' }
      },
      xaxis: {
        categories: ['TEMP °C', 'INLET Pr (MMWC)', 'VIBRATION (mm/sec)', 'OUTLET FLOW (ThNM₃/Hr)'],
        labels: {
          style: { colors: '#000', fontSize: '13px', fontWeight: 600 },
          rotate: -30,        // 👈 tilt labels for more space
          offsetY: 5,         // 👈 move labels slightly down
          trim: false,        // 👈 prevent truncation
        }
      },
      yaxis: {
        labels: { style: { colors: '#000' } }
      },
      title: {
        text: 'AGBS',
        align: 'center',
        style: { fontSize: '18px', color: '#004d40', fontWeight: 'bold' }
      },
      tooltip: {
        enabled: true,
        y: { formatter: (val: number) => val.toString() }
      }
    };

    // CGBS chart
    this.cgbsChart = {
      series: [
        { name: 'CGBS', data: [100, 500, 5.0, 6.0] }
      ],
      chart: {
        type: 'bar',
        height: 400,
        toolbar: { show: false },
        foreColor: '#000',
        animations: { enabled: false },
        parentHeightOffset: 30 // 👈 gives extra space at bottom
      },

      colors: ['#3498DB'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 6
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toString(),
        style: { colors: ['#000'], fontWeight: 'bold' }
      },
      xaxis: {
        categories: ['TEMP °C', 'INLET PRESSURE (MMWC)', 'VIBRATION (mm/sec)', 'OUTLET FLOW (ThNM₃/Hr)'],
        labels: {
          style: { colors: '#000', fontSize: '13px', fontWeight: 600 },
          rotate: -30,        // 👈 tilt labels for more space
          offsetY: 5,         // 👈 move labels slightly down
          trim: false,        // 👈 prevent truncation
        }
      },
      yaxis: {
        labels: { style: { colors: '#000' } }
      },
      title: {
        text: 'CGBS',
        align: 'center',
        style: { fontSize: '18px', color: '#004d40', fontWeight: 'bold' }
      },
      tooltip: {
        enabled: true,
        y: { formatter: (val: number) => val.toString() }
      }
    };
  }

  ngOnInit(): void {
  }

}
