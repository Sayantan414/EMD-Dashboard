import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
// import * as am5 from '@amcharts/amcharts5';
// import * as am5xy from '@amcharts/amcharts5/xy';
// import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";



import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend,
  ApexAxisChartSeries,
  ApexGrid,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexXAxis,
  ApexNonAxisChartSeries, //sourav code
  ApexResponsive,//sourav code
  ApexTooltip, //sourav code
  ApexMarkers,
  NgApexchartsModule
} from 'ng-apexcharts';
import { SseService } from 'app/services/sse.servece';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

//sourav code comment
// export type ChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   plotOptions: ApexPlotOptions;
//   legend: ApexLegend;
//   colors: string[];
// };
//sourav code comment

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  colors: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  grid?: ApexGrid;
  markers?: ApexMarkers;
};


//sourav code comment
// export type LineChartOptions = {
//   series: ApexAxisChartSeries;
//   chart: ApexChart;
//   dataLabels: ApexDataLabels;
//   stroke: ApexStroke;
//   title: ApexTitleSubtitle;
//   xaxis: ApexXAxis;
//   yaxis: ApexYAxis;
//   grid: ApexGrid;
//   colors: string[];
// };
//sourav code comment


//sourav code
export type RadialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  legend: ApexLegend;
  title: {}
};



export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
};

//sourav code

@Component({
  selector: 'app-dashboard',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class AreaComponent implements OnInit, OnDestroy {

  trendData = [
    { name: 'COB_BPP_GAS_G_F', min: 40123.49, max: 46199.06, avg: 43873.27, stdDev: 1211.64 },
    { name: 'COB_BPP_GAS_P', min: 847.95, max: 909.18, avg: 891.21, stdDev: 21.61 },
    { name: 'COB_C_BF_F', min: 0, max: 50951.41, avg: 39938.99, stdDev: 6203.45 },
    { name: 'PBS_C_B1_COG_F', min: 4206.00, max: 7579.40, avg: 7406.91, stdDev: 74.00 },
    { name: 'FS_C_BFG_F', min: 24435.10, max: 181416.89, avg: 91558.55, stdDev: 31145.27 },
  ];


  chartSeries: ApexAxisChartSeries = [
    { name: 'COB_BPP_GAS_G_F', data: [41000, 42000, 43000, 43500, 44000, 43800, 43900] },
    { name: 'COB_BPP_GAS_P', data: [40000, 35000, 890, 5000, 880, 910, 905] },
    { name: 'COB_C_BF_F', data: [20000, 25000, 27000, 30000, 29000, 31000, 30500] },
    { name: 'PBS_C_B1_COG_F', data: [5000, 6000, 6500, 7000, 6800, 6900, 7100] },
    { name: 'FS_C_BFG_F', data: [25000, 50000, 75000, 90000, 85000, 95000, 100000] },
  ];

  igcaFlow: number = 0;
  igcaPresser: number = 0;
  pgcaFlow: number = 0;
  pgcaPresser: number = 0;
  AI_6_COMP1: number = 0;
  AI_6_COMP2: number = 0;
  AI_6_COMP3: number = 0;
  AI_6_COMP4: number = 0;
  AI_6_COMP5: number = 0;
  AI_6_COMP6: number = 0;

  MOTOR_CURR_COMP1: number = 0;
  MOTOR_CURR_COMP2: number = 0;
  MOTOR_CURR_COMP3: number = 0;
  MOTOR_CURR_COMP4: number = 0;
  MOTOR_CURR_COMP5: number = 0;
  MOTOR_CURR_COMP6: number = 0;

  private sseSub?: Subscription;
  private ssetr?: Subscription;

  active_compath = './../../../assets/on.gif';
  deactive_compath = './../../../assets/off.gif';
  // active_compath = './../../../assets/compressor_running_with_smoke.gif';
  // deactive_compath = './../../../assets/compressor (1).png';
  // trendData = []; //sourav code comment

  //sourav code
  @ViewChild('chart') chart!: ChartComponent;


  public radialChart1: RadialChartOptions = {
    series: [],
    chart: { type: 'radialBar' },
    labels: [],
    colors: [],
    responsive: [],
    plotOptions: {},
    legend: {},
    title: {}
  };

  public radialChart2: RadialChartOptions = {
    series: [],
    chart: { type: 'radialBar' },
    labels: [],
    colors: [],
    plotOptions: {},
    responsive: [],
    legend: {},
    title: {}
  };

  public radialChart3: RadialChartOptions = {
    series: [],
    chart: { type: 'radialBar' },
    labels: [],
    colors: [],
    plotOptions: {},
    responsive: [],
    legend: {},
    title: {}
  };

  public radialChart4: RadialChartOptions = {
    series: [],
    chart: { type: 'radialBar' },
    labels: [],
    colors: [],
    plotOptions: {},
    responsive: [],
    legend: {},
    title: {}
  };

  public areaChart: AreaChartOptions = {
    series: [],
    chart: { type: 'line' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    title: { text: '', align: 'left' },
    grid: {},
    xaxis: {},
    yaxis: {},
    colors: [],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      labels: { colors: 'var(--bar-text)', useSeriesColors: false },

    }, tooltip: {
      theme: 'dark',                  // dark background theme
      style: {
        fontSize: '12px'              // ✅ only fontSize allowed
      },
      // marker: { show: true }
    },

    markers: {                     // ✅ outside tooltip
      size: 4,
      colors: ['#fff'],
      strokeColors: '#000',
      strokeWidth: 2,
      hover: { size: 6 }
    }

  };

  //sourav code
  chartOptions!: Partial<ChartOptions>;
  // private root!: am5.Root;
  constructor(private sseService: SseService,
    private zone: NgZone
  ) { }

  splitLetters(text: string): string[] {
    return text.split('').map((c) => (c === ' ' ? '\u00A0' : c));
  }

  ngOnInit(): void {
    //sourav code

    // Radial chart 1 (Compressor 1 Pressure)
    this.radialChart1 = {
      series: [89],
      chart: {
        height: 200,
        type: 'radialBar',
        toolbar: { show: false }
      },
      labels: ['Pressure (psi)'],
      colors: ['var(--header-text)'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: '10px',     // ✅ label text size ("Pressure (psi)")
              fontWeight: 400,
              color: 'var(--header-text)',
              offsetY: 10
            },
            value: {
              show: true,
              fontSize: '12px',     // ✅ numeric value text size ("76")
              fontWeight: 500,
              color: 'var(--header-text)',
              offsetY: -20
            }
          }
        }
      },

      responsive: [{
        breakpoint: 480,
        options: { chart: { height: 100 } }
      }],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: 'var(--bar-text)',
          useSeriesColors: true
        },
        formatter: (seriesName, opts) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value}`; // Legend will show "Pressure (psi): 76%"
        },
        onItemClick: {
          toggleDataSeries: true
        }
      },
      title: {
        text: 'Compressor 1 Pressure',
        align: 'center',
        style: { fontSize: '16px', color: '#333' }
      }
    };


    // Radial chart 2 (Compressor 2 Flow)
    this.radialChart2 = {
      series: [45],
      chart: {
        height: 200,
        type: 'radialBar',
        toolbar: { show: false }
      },
      labels: ['Flow (m³/min)'],
      colors: ['var(--header-text)'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: '10px',     // ✅ label text size ("Pressure (psi)")
              fontWeight: 400,
              color: 'var(--header-text)',
              offsetY: 10
            },
            value: {
              show: true,
              fontSize: '12px',     // ✅ numeric value text size ("76")
              fontWeight: 500,
              color: 'var(--header-text)',
              offsetY: -20
            }
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: { chart: { height: 200 } }
      }],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: 'var(--bar-text)',
          useSeriesColors: true
        },
        formatter: (seriesName, opts) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value}%`; // Legend will show "Flow (m³/min): 45%"
        },
        onItemClick: {
          toggleDataSeries: true
        }
      },
      title: {
        text: 'Compressor 2 Flow',
        align: 'center',
        style: { fontSize: '16px', color: '#333' }
      }
    };



    // Radial chart 3 (Compressor 3 Pressure)
    this.radialChart3 = {
      series: [60],
      chart: {
        height: 200,
        type: 'radialBar',
        toolbar: { show: false }
      },
      labels: ['Pressure (psi)'],
      colors: ['var(--header-text)'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: '10px',     // ✅ label text size ("Pressure (psi)")
              fontWeight: 400,
              color: 'var(--header-text)',
              offsetY: 10
            },
            value: {
              show: true,
              fontSize: '12px',     // ✅ numeric value text size ("76")
              fontWeight: 500,
              color: 'var(--header-text)',
              offsetY: -20
            }
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: { chart: { height: 200 } }
      }],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: 'var(--bar-text)',
          useSeriesColors: true
        },
        formatter: (seriesName, opts) => {
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value}%`; // Legend will show "Pressure (psi): 60%"
        },
        onItemClick: {
          toggleDataSeries: true
        }
      },
      title: {
        text: 'Compressor 3 Pressure',
        align: 'center',
        style: { fontSize: '16px', color: '#333' }
      }
    };


    // Radial chart 4 (Compressor 4 Flow)
    this.radialChart4 = {
      series: [50],
      chart: {
        height: 200,
        type: 'radialBar',
        toolbar: { show: false }
      },
      labels: ['Flow (m³/min)'],
      colors: ['var(--header-text)'],
      plotOptions: {
        radialBar: {
          dataLabels: {
            show: true,
            name: {
              show: true,
              fontSize: '10px',     // ✅ label text size ("Pressure (psi)")
              fontWeight: 400,
              color: 'var(--header-text)',
              offsetY: 10
            },
            value: {
              show: true,
              fontSize: '12px',     // ✅ numeric value text size ("76")
              fontWeight: 500,
              color: 'var(--header-text)',
              offsetY: -20
            }
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: { chart: { height: 200 } }
      }],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: 'var(--bar-text)',
          useSeriesColors: true
        },
        formatter: (seriesName, opts) => {
          // opts.seriesIndex gives the index of the series
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${seriesName}: ${value}%`; // legend will show "Flow (m³/min): 50"
        },
        onItemClick: {
          toggleDataSeries: true
        }
      },
      title: {
        text: 'Compressor 4 Flow',
        align: 'center',
        style: { fontSize: '16px', color: '#333' }
      }
    };

    this.chartOptions = {
      chart: {
        type: "line",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: "zoom"
        }
      },



      stroke: {
        width: 2,
        curve: 'smooth'
      },
      colors: [
        '#00ff00', // COB_BPP_GAS_G_F
        '#ff00ff', // COB_BPP_GAS_P
        '#ff9900', // COB_C_BF_F
        '#00ffff', // PBS_C_B1_COG_F
        '#ff3333'  // FS_C_BFG_F
      ],
      xaxis: {
        categories: ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30'],
        labels: {
          style: {
            colors: '#99ccff',
            fontSize: '12px'
          }
        },
        axisBorder: { color: '#355b8c' },
        axisTicks: { color: '#355b8c' },
        tooltip: { enabled: false }
      },
      yaxis: {
        min: 0,
        max: 2000,
        tickAmount: 4, // (0, 500, 1000, 1500, 2000)
        labels: {
          formatter: (val) => val.toFixed(2), // show 2 decimal places
          style: {
            colors: '#99ccff',
            fontSize: '12px'
          }
        },
        axisBorder: { color: '#355b8c' },
        axisTicks: { color: '#355b8c' }
      },

      grid: {
        show: true,
        borderColor: '#355b8c',
        strokeDashArray: 2,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        labels: { colors: '#ffffff' },
        markers: {
          width: 10, height: 10, radius: 2,
          offsetX: -5 // move marker slightly left or right
        },
        itemMargin: {
          horizontal: 15,
          vertical: 10   // <-- adds vertical gap between legend and chart
        }
      },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        shared: false,      // ✅ show only the hovered series value
        intersect: true,    // ✅ tooltip shows only when hovering a point
        followCursor: true,
        theme: 'dark',
        x: { show: true },
        y: {
          formatter: (val) => val ? val.toFixed(2) : ''
        }
      },


      markers: {
        size: 4,
        colors: undefined,
        strokeColors: '#ffffff',
        strokeWidth: 1.5,
        hover: { size: 7 }
      }
    };

    //sourav code

    // this.zone.runOutsideAngular(() => {
    //   // Create root
    //   const root = am5.Root.new('chartdiv');
    //   this.root = root;

    //   // Apply theme
    //   root.setThemes([am5themes_Animated.new(root)]);

    //   // Create chart
    //   const chart = root.container.children.push(
    //     am5xy.XYChart.new(root, {
    //       panX: true,
    //       panY: true,
    //       wheelX: 'panX',
    //       wheelY: 'zoomX',
    //       pinchZoomX: true,
    //       paddingLeft: 0
    //     })
    //   );

    //   // Add cursor
    //   const cursor = chart.set(
    //     'cursor',
    //     am5xy.XYCursor.new(root, { behavior: 'none' })
    //   );
    //   cursor.lineY.set('visible', false);

    //   // Generate random data
    //   let date = new Date();
    //   date.setHours(0, 0, 0, 0);
    //   let value = 100;

    //   function generateData() {
    //     value = Math.round(Math.random() * 10 - 5 + value);
    //     am5.time.add(date, 'day', 1);
    //     return { date: date.getTime(), value: value };
    //   }

    //   function generateDatas(count: number) {
    //     const data: any[] = [];
    //     for (let i = 0; i < count; ++i) {
    //       data.push(generateData());
    //     }
    //     return data;
    //   }

    //   // Create axes
    //   const xAxis = chart.xAxes.push(
    //     am5xy.DateAxis.new(root, {
    //       maxDeviation: 0.2,
    //       baseInterval: { timeUnit: 'day', count: 1 },
    //       renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
    //       tooltip: am5.Tooltip.new(root, {})
    //     })
    //   );

    //   const yAxis = chart.yAxes.push(
    //     am5xy.ValueAxis.new(root, {
    //       renderer: am5xy.AxisRendererY.new(root, { pan: 'zoom' })
    //     })
    //   );

    //   // Create series
    //   const series = chart.series.push(
    //     am5xy.LineSeries.new(root, {
    //       name: 'Series',
    //       xAxis: xAxis,
    //       yAxis: yAxis,
    //       valueYField: 'value',
    //       valueXField: 'date',
    //       tooltip: am5.Tooltip.new(root, { labelText: '{valueY}' })
    //     })
    //   );

    //   // Add scrollbar
    //   chart.set(
    //     'scrollbarX',
    //     am5.Scrollbar.new(root, { orientation: 'horizontal' })
    //   );

    //   // Set data
    //   const data = generateDatas(1200);
    //   series.data.setAll(data);

    //   // Animate on load
    //   series.appear(1000);
    //   chart.appear(1000, 100);
    // });

    // this.zone.runOutsideAngular(() => {
    //   // Create root
    //   const root = am5.Root.new('chartdiv');
    //   this.root = root;

    //   // Apply theme
    //   root.setThemes([am5themes_Animated.new(root)]);

    //   // Create chart
    //   const chart = root.container.children.push(
    //     am5xy.XYChart.new(root, {
    //       panX: true,
    //       panY: true,
    //       wheelX: 'panX',
    //       wheelY: 'zoomX',
    //       pinchZoomX: true,
    //       paddingLeft: 0,

    //     })
    //   );

    //   // Add cursor (for zoom and tooltip)
    //   const cursor = chart.set(
    //     'cursor',
    //     am5xy.XYCursor.new(root, {
    //       behavior: 'zoomX',
    //     })
    //   );
    //   cursor.lineY.set('visible', false);

    //   // Create X Axis (Time or Categories)
    //   const xAxis = chart.xAxes.push(
    //     am5xy.CategoryAxis.new(root, {
    //       categoryField: 'time',
    //       renderer: am5xy.AxisRendererX.new(root, {
    //         minGridDistance: 40,
    //         minorGridEnabled: true
    //       }),
    //       tooltip: am5.Tooltip.new(root, {})
    //     })
    //   );

    //   xAxis.get('renderer').labels.template.setAll({
    //     fill: am5.color(0x99ccff),
    //     fontSize: 12
    //   });

    //   xAxis.get('renderer').grid.template.setAll({
    //     stroke: am5.color(0x355b8c),
    //     strokeOpacity: 0.5
    //   });

    //   // Create Y Axis
    //   const yAxis = chart.yAxes.push(
    //     am5xy.ValueAxis.new(root, {
    //       min: 0,
    //       max: 2000,
    //       strictMinMax: true,
    //       renderer: am5xy.AxisRendererY.new(root, {})
    //     })
    //   );

    //   yAxis.get('renderer').labels.template.setAll({
    //     fill: am5.color(0x99ccff),
    //     fontSize: 12,
    //     text: '{value.formatNumber("#,###.00")}'
    //   });

    //   yAxis.get('renderer').grid.template.setAll({
    //     stroke: am5.color(0x355b8c),
    //     strokeOpacity: 0.5
    //   });

    //   // ✅ Data setup (similar to Apex categories)
    //   const categories = ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30'];

    //   const chartData = categories.map((t, i) => ({
    //     time: t,
    //     COB_BPP_GAS_G_F: 400 + Math.sin(i) * 100 + Math.random() * 50,  // fluctuates
    //     COB_BPP_GAS_P: 300 + Math.cos(i) * 120 + Math.random() * 60,
    //     COB_C_BF_F: 250 + Math.sin(i * 1.5) * 80 + Math.random() * 40,
    //     PBS_C_B1_COG_F: 200 + Math.cos(i * 1.2) * 90 + Math.random() * 50,
    //     FS_C_BFG_F: 150 + Math.sin(i * 1.8) * 110 + Math.random() * 30
    //   }));

    //   xAxis.data.setAll(chartData);

    //   // ✅ Colors same as ApexCharts
    //   const colors = [
    //     '#00ff00', // COB_BPP_GAS_G_F
    //     '#ff00ff', // COB_BPP_GAS_P
    //     '#ff9900', // COB_C_BF_F
    //     '#00ffff', // PBS_C_B1_COG_F
    //     '#ff3333'  // FS_C_BFG_F
    //   ];

    //   const seriesNames = [
    //     'COB_BPP_GAS_G_F',
    //     'COB_BPP_GAS_P',
    //     'COB_C_BF_F',
    //     'PBS_C_B1_COG_F',
    //     'FS_C_BFG_F'
    //   ];

    //   // ✅ Create multiple line series
    //   seriesNames.forEach((name, index) => {
    //     const series = chart.series.push(
    //       am5xy.LineSeries.new(root, {
    //         name,
    //         xAxis,
    //         yAxis,
    //         categoryXField: 'time',
    //         valueYField: name,
    //         stroke: am5.color(colors[index]),
    //         fill: am5.color(colors[index]),
    //         tooltip: am5.Tooltip.new(root, {
    //           labelText: `{name}: {valueY.formatNumber("#.00")}`
    //         })
    //       })
    //     );

    //     // Smooth line and markers
    //     series.strokes.template.setAll({
    //       strokeWidth: 2,
    //       templateField: 'stroke',
    //       stroke: am5.color(colors[index])
    //     });

    //     series.bullets.push(() =>
    //       am5.Bullet.new(root, {
    //         sprite: am5.Circle.new(root, {
    //           radius: 4,
    //           fill: am5.color(colors[index]),
    //           stroke: am5.color(0xffffff),
    //           strokeWidth: 1.5
    //         }
    //         )
    //       })
    //     );

    //     series.data.setAll(chartData);
    //     series.appear(1000);
    //   });

    //   // ✅ Add Legend
    //   const legend = chart.children.push(
    //     am5.Legend.new(root, {
    //       centerX: am5.p50,
    //       x: am5.p50,
    //       layout: root.horizontalLayout,
    //       marginTop: 20
    //     })
    //   );

    //   legend.data.setAll(chart.series.values);

    //   // ✅ Scrollbar for zoom
    //   chart.set(
    //     'scrollbarX',
    //     am5.Scrollbar.new(root, { orientation: 'horizontal' })
    //   );

    //   // ✅ Animate on load
    //   chart.appear(1000, 100);
    // });

  }


  // Helper method to update chart data

  ngOnDestroy(): void {

    // Dispose the chart when component is destroyed
    // if (this.root) {
    //   this.root.dispose();
    // }
  }

}
