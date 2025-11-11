// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { debounceTime } from 'rxjs/operators';
// import {
//   ApexChart,
//   ChartComponent,
//   ApexDataLabels,
//   ApexPlotOptions,
//   ApexLegend,
//   ApexAxisChartSeries,
// } from 'ng-apexcharts';
// import { SseService } from 'src/app/service/sse.servece';

// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   plotOptions: ApexPlotOptions;
//   legend: ApexLegend;
//   colors: string[];
// };

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.scss'],
// })
// export class DashboardComponent implements OnInit {
//   @ViewChild('chart1') chart1!: ChartComponent;
//   @ViewChild('chart2') chart2!: ChartComponent;
//   @ViewChild('chart3') chart3!: ChartComponent;
//   @ViewChild('chart4') chart4!: ChartComponent;
//   @ViewChild('chart5') chart5!: ChartComponent;
//   @ViewChild('chart6') chart6!: ChartComponent;

//   igcaFlow: number = 0;
//   igcaPresser: number = 0;
//   pgcaFlow: number = 0;
//   pgcaPresser: number = 0;
//   AI_6_COMP1: number = 0;
//   AI_6_COMP2: number = 0;
//   AI_6_COMP3: number = 0;
//   AI_6_COMP4: number = 0;
//   AI_6_COMP5: number = 0;
//   AI_6_COMP6: number = 0;

//   MOTOR_CURR_COMP1: number = 0;
//   MOTOR_CURR_COMP2: number = 0;
//   MOTOR_CURR_COMP3: number = 0;
//   MOTOR_CURR_COMP4: number = 0;
//   MOTOR_CURR_COMP5: number = 0;
//   MOTOR_CURR_COMP6: number = 0;

//   private sseSub?: Subscription;
//   public chartOptions1: ChartOptions;
//   public chartOptions2: ChartOptions;
//   public chartOptions3: ChartOptions;
//   public chartOptions4: ChartOptions;
//   public chartOptions5: ChartOptions;
//   public chartOptions6: ChartOptions;

//   active_compath = './../../../assets/compressor_running_with_smoke.gif';
//   deactive_compath = './../../../assets/compressor (1).png';

//   constructor(private sseService: SseService) {
//     // Initialize all chart options
//     const baseChartOptions = {
//       chart: {
//         height: 105,
//         type: 'bar',
//         toolbar: {
//           show: true,
//           tools: {
//             download: false,
//             selection: true,
//             zoom: true,
//             zoomin: true,
//             zoomout: true,
//             pan: true,
//             reset: true,
//           },
//         },
//         animations: {
//           enabled: false,
//         },
//       },
//       plotOptions: {
//         bar: {
//           horizontal: true,
//         },
//       },
//       colors: ['#084c35'],
//       dataLabels: {
//         formatter: function (val: any, opts) {
//           const goals =
//             opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
//               .goals;

//           if (goals && goals.length) {
//             return `${val} / ${goals[0].value}`;
//           }
//           return val;
//         },
//       },
//       legend: {
//         show: true,
//         showForSingleSeries: true,
//         customLegendItems: ['Current', 'Limit'],
//         markers: {
//           fillColors: ['#00E396', '#775DD0'],
//         },
//       },
//     };

//     // Create individual chart options for each compressor
//     this.chartOptions1 = {
//       ...baseChartOptions,
//       series: [
//         {
//           name: 'Actual',
//           data: [
//             {
//               x: 'Current Amp',
//               y: this.MOTOR_CURR_COMP1,
//               goals: [
//                 {
//                   name: 'Expected',
//                   value: 600,
//                   strokeWidth: 5,
//                   strokeColor: '#775DD0',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     this.chartOptions2 = {
//       ...baseChartOptions,
//       series: [
//         {
//           name: 'Actual',
//           data: [
//             {
//               x: 'Current Amp',
//               y: this.MOTOR_CURR_COMP2,
//               goals: [
//                 {
//                   name: 'Expected',
//                   value: 600,
//                   strokeWidth: 5,
//                   strokeColor: '#775DD0',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     this.chartOptions3 = {
//       ...baseChartOptions,
//       series: [
//         {
//           name: 'Actual',
//           data: [
//             {
//               x: 'Current Amp',
//               y: this.MOTOR_CURR_COMP3,
//               goals: [
//                 {
//                   name: 'Expected',
//                   value: 600,
//                   strokeWidth: 5,
//                   strokeColor: '#775DD0',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     this.chartOptions4 = {
//       ...baseChartOptions,
//       series: [
//         {
//           name: 'Actual',
//           data: [
//             {
//               x: 'Current Amp',
//               y: this.MOTOR_CURR_COMP4,
//               goals: [
//                 {
//                   name: 'Expected',
//                   value: 600,
//                   strokeWidth: 5,
//                   strokeColor: '#775DD0',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     this.chartOptions5 = {
//       ...baseChartOptions,
//       series: [
//         {
//           name: 'Actual',
//           data: [
//             {
//               x: 'Current Amp',
//               y: this.MOTOR_CURR_COMP5,
//               goals: [
//                 {
//                   name: 'Expected',
//                   value: 600,
//                   strokeWidth: 5,
//                   strokeColor: '#775DD0',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     this.chartOptions6 = {
//       ...baseChartOptions,
//       series: [
//         {
//           name: 'Actual',
//           data: [
//             {
//               x: 'Current Amp',
//               y: this.MOTOR_CURR_COMP6,
//               goals: [
//                 {
//                   name: 'Expected',
//                   value: 600,
//                   strokeWidth: 5,
//                   strokeColor: '#775DD0',
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };
//   }

//   ngOnInit(): void {
//     this.sseSub = this.sseService
//       .getServerSentEvent('http://10.150.6.15:4060/api/utility/ccas_dashboard')
//       .pipe(debounceTime(100))
//       .subscribe((data: any) => {
//         this.igcaFlow = parseInt(data.IGCA_FLOW);
//         this.igcaPresser = parseFloat(data.IGCA_PRESSER.toFixed(2));
//         this.pgcaFlow = parseInt(data.PGCA_FLOW);
//         this.pgcaPresser = parseFloat(data.PGCA_PRESSER.toFixed(2));
//         this.AI_6_COMP1 = parseInt(data.AI_6_COMP1);
//         this.AI_6_COMP2 = parseInt(data.AI_6_COMP2);
//         this.AI_6_COMP3 = parseInt(data.AI_6_COMP3);
//         this.AI_6_COMP4 = parseInt(data.AI_6_COMP4);
//         this.AI_6_COMP5 = parseInt(data.AI_6_COMP5);
//         this.AI_6_COMP6 = parseInt(data.AI_6_COMP6);
//         this.MOTOR_CURR_COMP1 = parseInt(data.MOTOR_CURR_COMP1);
//         this.MOTOR_CURR_COMP2 = parseInt(data.MOTOR_CURR_COMP2);
//         this.MOTOR_CURR_COMP3 = parseInt(data.MOTOR_CURR_COMP3);
//         this.MOTOR_CURR_COMP4 = parseInt(data.MOTOR_CURR_COMP4);
//         this.MOTOR_CURR_COMP5 = parseInt(data.MOTOR_CURR_COMP5);
//         this.MOTOR_CURR_COMP6 = parseInt(data.MOTOR_CURR_COMP6);

//         // Update all charts without causing full re-render
//         this.updateChart(this.chart1, this.MOTOR_CURR_COMP1);
//         this.updateChart(this.chart2, this.MOTOR_CURR_COMP2);
//         this.updateChart(this.chart3, this.MOTOR_CURR_COMP3);
//         this.updateChart(this.chart4, this.MOTOR_CURR_COMP4);
//         this.updateChart(this.chart5, this.MOTOR_CURR_COMP5);
//         this.updateChart(this.chart6, this.MOTOR_CURR_COMP6);
//       });
//   }

//   // Helper method to update chart data
//   private updateChart(chart: ChartComponent | undefined, value: number): void {
//     if (chart) {
//       chart.updateSeries(
//         [
//           {
//             name: 'Actual',
//             data: [
//               {
//                 x: 'Current Amp',
//                 y: value,
//                 goals: [
//                   {
//                     name: 'Expected',
//                     value: 600,
//                     strokeWidth: 5,
//                     strokeColor: '#775DD0',
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//         false
//       );
//     }
//   }

//   ngOnDestroy(): void {
//     // Clean up subscription to prevent memory leaks
//     if (this.sseSub) {
//       this.sseSub.unsubscribe();
//     }
//   }
// }
