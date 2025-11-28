import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { SseService } from "app/services/sse.servece";
import { Subject, Subscription, takeUntil } from "rxjs";
import * as FusionCharts from "fusioncharts";
import * as Widgets from "fusioncharts/fusioncharts.widgets";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { FusionChartsModule } from "angular-fusioncharts";
// Removed invalid import for HighchartsChartModule
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexStroke,
  ApexFill,
  ApexTooltip,
} from "ng-apexcharts";
import { TrendService } from "app/services/trend.service";
import { MatSnackBar } from "@angular/material/snack-bar";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  colors?: string[];
};

@Component({
  selector: "app-dashboard",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"],
  standalone: true,
  imports: [ProjectCommonModule, FusionChartsModule],
})
export class AreaComponent implements OnInit, OnDestroy {
  // makeGauge!: Partial<ChartOptions>;
  // pressureGauge!: Partial<ChartOptions>;
  makeGauge1!: Partial<ChartOptions>;
  makeGauge2!: Partial<ChartOptions>;
  makeGauge3!: Partial<ChartOptions>;
  pressureGauge1!: Partial<ChartOptions>;
  pressureGauge2!: Partial<ChartOptions>;
  pressureGauge3!: Partial<ChartOptions>;

  make = "C.O. GAS MAKE [Th. Nm³/hr]";
  pressure = "C.O. GAS PRESSURE [mmwc]";
  bv = "BLAST VOLUME [Nm³/min]";
  bp = "BLAST PRESSURE [Kg/cm²]";

  max_gasmake_cob10 = 80000;
  max_gasmake_cob11 = 60000;
  max_gasmake_bf5 = 10000;

  max_pressure_cob10 = 4000;
  max_pressure_cob11 = 3500;
  max_pressure_bf5 = 10;

  cob10_res = {
    benzol_scrubber_gasmake: 0,
    cogas_supply_pressure: 0,
    cog_gasflow: 0,
  };

  overview_res = {
    BLAST_VOLUME: 0,
    BLAST_PRESSURE: 0,
    FLARE_STACK_FLOW: 0,
    FLARE_STACK_PRESSURE: 0,
    SNORT_POSITION: 0,
    MG_WRM_FLOW: 0,
    MG_BRM_FLOW: 0,
    MG_USM_FLOW: 0,
    TOTAL_FLOW: 0,
    MG_WRM_PRESSURE: 0,
    MG_BRM_PRESSURE: 0,
    MG_USM_PRESSURE: 0,
    MIX_GAS_PRESSURE: 0,
    CV: 0,
    CBM_FLOW: 0,
    BOF_FLOW: 0,
    STOVE_1_BF_GAS: 0,
    STOVE_2_BF_GAS: 0,
    STOVE_3_BF_GAS: 0,
    STOVE_4_BF_GAS: 0,
    CO_GAS_CONSUMPTION: 0,
    CDI_COG_CONSUMPTION: 0,
    COG123: 0,
    BFG123: 0,
    CBM_GAS123: 0,
    BOF_GAS_TOTAL: 0,
    K_1_FLOW: 0,
    K_2_FLOW: 0,
    K_3_FLOW: 0,
    K_4_FLOW: 0,
    INLET_PRESSURE: 0,
    TOTAL_CONSUMPTION: 0,
    MAKE: 0,
    PRESSURE: 0,
    FLARE_FLOW: 0,
    FLARE_PRESSURE: 0,
    U_F_N_1_BLOCK_COG: 0,
    U_F_N_1_BLOCK_BFG: 0,
    U_F_N_2_BLOCK_COG: 0,
    U_F_N_2_BLOCK_BFG: 0,
    FLARE_STACK_SET_POINT: 0,
    M1VOLUME: 0,
    M1FLOW: 0,
    M2VOLUME: 0,
    M2FLOW: 0,
    INLETPRESSURE: 0,
    OUTLETPRESSURE: 0,
    GASHOLDERPRES: 0,
    GASHOLDERTEMP: 0,
    EXPORTEDGAS: 0,
    GAS_FLOW_mills: 0,

    COB10_GASMAKEF: 0,
    SP1_MIXGASPRESS: 0,
    SP1_MIXGASF: 0,
    SP2_MIXGASPRESS: 0,
    SP2_MIXGASF: 0,
    BF_COF: 0,

    GASHOLDERLVL: 0,
    BOF_GASRECTOT: 0,
  };

  previousValues: any = { ...this.overview_res };
  previouscob10Values: any = { ...this.cob10_res };

  private sseoverview?: Subscription;
  private cob10overview?: Subscription;

  volumeClockChart: any;

  // graph representation
  private root!: am5.Root;
  responseData: any = [];
  hasMake: boolean = true;
  hasPressure: boolean = true;
  loading: boolean = true;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private sseService: SseService,
    private trendService: TrendService,
    private _snackBar: MatSnackBar
  ) {
    FusionChartsModule.fcRoot(FusionCharts, Widgets, FusionTheme);
  }

  fusionMakeCOB11: any = {
    chart: {
      lowerLimit: "0",
      upperLimit: "60000", // Default
      theme: "fusion",
    },
    colorRange: {
      color: [
        { minValue: "0", maxValue: "2000", code: "#00ff0a" },
        { minValue: "2000", maxValue: "6000", code: "#ffcc00" },
        { minValue: "6000", maxValue: "10000", code: "#00E5FF" },
      ],
    },
    dials: {
      dial: [{ value: 0, color: "#ff0000" }],
    },
  };

  fusionPressureCOB11: any = {
    chart: {
      lowerLimit: "0",
      upperLimit: "3500",
      theme: "fusion",
    },
    colorRange: {
      color: [
        { minValue: "0", maxValue: "2000", code: "#00ff0a" },
        { minValue: "2000", maxValue: "6000", code: "#ffcc00" },
        { minValue: "6000", maxValue: "10000", code: "#00E5FF" },
      ],
    },
    dials: {
      dial: [{ value: 0, color: "#ff0000" }],
    },
  };

  splitLetters(text: string): string[] {
    return text.split("").map((c) => (c === " " ? "\u00A0" : c));
  }

  animateValue(
    start: number,
    end: number,
    duration: number,
    callback: (val: number) => void,
    decimals: number = 0
  ) {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = start + (end - start) * progress;

      // keep decimals
      const formattedValue = parseFloat(value.toFixed(decimals));
      callback(formattedValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  ngOnInit(): void {
    this.initializeCharts();
    this.loadData();
    this.getCob10Data();
    this.getCob11Data();
  }

  createBlastVolumeClock(value: number) {
    this.volumeClockChart = {
      width: "100%",
      height: "260",
      type: "angulargauge",
      dataFormat: "json",
      dataSource: {
        chart: {
          caption: "",
          lowerLimit: "0",
          upperLimit: this.max_gasmake_bf5 || 10000,
          showValue: "0",
          gaugeFillMix: "{light+0}",
          theme: "fusion",
          showTickMarks: "1",
          showTickValues: "1",
          majorTMNumber: "12", // Show 12 numbers like a clock
          majorTMHeight: "20",
        },
        // colorRange: {
        //   color: [
        //     {
        //       minValue: "0",
        //       maxValue: this.max_gasmake_bf5,
        //       code: "#dddddd"
        //     }
        //   ]
        // },
        // ⭐ Color zones
        colorRange: {
          color: [
            { minValue: "0", maxValue: "2000", code: "#00ff0a" }, // green
            { minValue: "2000", maxValue: "6000", code: "#ffcc00" }, // yellow
            { minValue: "6000", maxValue: "10000", code: "#00E5FF" }, // red
          ],
        },
        dials: {
          dial: [
            {
              value,
              rearExtension: "0",
              baseWidth: "6",
              topWidth: "1",
              radius: "90",
              color: "#ff0000",
            },
          ],
        },
      },
    };
  }

  initializeCharts() {
    const baseGauge: Partial<ChartOptions> = {
      series: [0],
      chart: { height: 250, type: "radialBar" },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: { size: "70%" },
          dataLabels: {
            name: {
              show: true,
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--header_active)",
              offsetY: 10,
            },
            value: {
              show: false, // ✅ completely hide numeric value
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: { shade: "light", type: "horizontal", stops: [0, 100] },
      },
      stroke: { lineCap: "round" },
    };

    this.makeGauge1 = { ...baseGauge, labels: ["COB#10"] };
    // this.makeGauge2 = { ...baseGauge, labels: ["COB#11"] };
    this.makeGauge3 = { ...baseGauge, labels: ["BF#5 KALYANI"] };
    this.pressureGauge1 = { ...baseGauge, labels: ["COB#10"] };
    // this.pressureGauge2 = { ...baseGauge, labels: ["COB#11"] };
    this.pressureGauge3 = { ...baseGauge, labels: ["BF#5 KALYANI"] };
  }

  loadData() {
    this.sseoverview = this.sseService.getcob10().subscribe((data: any) => {
      // console.log('Result', data);
      // console.log(this.bf5_res);
      // Animate each property
      this.animateValue(
        this.previousValues.benzol_scrubber_gasmake,
        data.benzol_scrubber_gasmake,
        800, // ms
        (val) => {
          if (isNaN(val)) this.cob10_res.benzol_scrubber_gasmake = 0;
          else this.cob10_res.benzol_scrubber_gasmake = val;

          // ✅ Update gauge
          const maxGasMake = this.max_gasmake_cob10 || 80000; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.makeGauge1.series = [percent];
        }
      );

      this.animateValue(
        this.previousValues.cogas_supply_pressure,
        data.cogas_supply_pressure,
        800,
        (val) => {
          if (isNaN(val)) this.cob10_res.cogas_supply_pressure = 0;
          else this.cob10_res.cogas_supply_pressure = val;

          // ✅ Update pressure gauge
          const maxPressure = this.max_pressure_cob10 || 4000;
          const percent = Math.min((val / maxPressure) * 100, 100);
          this.pressureGauge1.series = [percent];
        },
        2
      );

      // Update previous values for next round
      this.previousValues = { ...data };
    });

    this.cob10overview = this.sseService
      .getOverview()
      .subscribe((data: any) => {
        // console.log("Result", data);

        this.animateValue(
          this.previouscob10Values.MAKE,
          data.MAKE,
          800, // ms
          (val) => {
            if (isNaN(val)) this.overview_res.MAKE = 0;
            else this.overview_res.MAKE = val;

            // ✅ Update gauge
            const maxGasMake = this.max_gasmake_cob11 || 60000; // fallback if API doesn't send
            const percent = Math.min((val / maxGasMake) * 100, 100);
            // this.makeGauge2.series = [percent];
            // Update FusionCharts gauge
            this.fusionMakeCOB11.dials.dial[0].value = val;
          }
        );

        this.animateValue(
          this.previouscob10Values.PRESSURE,
          data.PRESSURE,
          800,
          (val) => {
            if (isNaN(val)) this.overview_res.PRESSURE = 0;
            else this.overview_res.PRESSURE = val;

            // ✅ Update pressure gauge
            const maxPressure = this.max_pressure_cob11 || 3500;
            const percent = Math.min((val / maxPressure) * 100, 100);
            // this.pressureGauge2.series = [percent];

            this.fusionPressureCOB11.dials.dial[0].value = val;
          },
          2
        );

        this.animateValue(
          this.previouscob10Values.BLAST_VOLUME,
          data.BLAST_VOLUME,
          800, // ms
          (val) => {
            if (isNaN(val)) this.overview_res.BLAST_VOLUME = 0;
            else this.overview_res.BLAST_VOLUME = val;

            // ✅ Update gauge
            const maxGasMake = this.max_gasmake_bf5 || 50000; // fallback if API doesn't send
            const percent = Math.min((val / maxGasMake) * 100, 100);
            this.makeGauge3.series = [percent];
            this.createBlastVolumeClock(val);
          }
        );

        this.animateValue(
          this.previouscob10Values.BLAST_PRESSURE,
          data.BLAST_PRESSURE,
          800,
          (val) => {
            if (isNaN(val)) this.overview_res.BLAST_PRESSURE = 0;
            else this.overview_res.BLAST_PRESSURE = val;

            // ✅ Update pressure gauge
            const maxPressure = this.max_pressure_bf5 || 10;
            const percent = Math.min((val / maxPressure) * 100, 100);
            this.pressureGauge3.series = [percent];
          },
          2
        );

        this.previouscob10Values = { ...data };
      });
  }

  //*** COB#10  ***//
  getCob10Data() {
    this.trendService
      .cob10_trend({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          const data = JSON.parse(JSON.stringify(response));

          this.responseData = JSON.parse(JSON.stringify(response));

          if (data.length === 0) {
            this.hasMake = false;
            this.hasPressure = false;
          } else {
            // Prepare data for the chart
            const chartData = response.map((data: any) => ({
              date: new Date(data.datestamp).getTime(),
              gasmake: data.benzol_scrubber_gasmake,
              pressure: data.cogas_supply_pressure,
              gasflow: data.cog_gasflow,
            }));

            // Create two charts
            this.createGasMakeChartCob10(chartData);
          }
        },
        error: (err) => {
          this._snackBar.open(err, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  createGasMakeChartCob10(chartData: any[]) {
    let root = am5.Root.new("cob10gasmakeChart1");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.set("forceHidden", true);

    // ⭐ Get CSS variable color
    let axisColor = getComputedStyle(document.body)
      .getPropertyValue("--charttext")
      .trim();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "zoomX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        groupData: false,
      })
    );

    // Format labels
    xAxis.set("dateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    xAxis.set("tooltipDateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    // ⭐ Correct method
    xAxis.get("renderer").set("minGridDistance", 40);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // ⭐ APPLY COLOR TO AXIS LABELS
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });
    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });

    // ⭐ Optional: color grid lines + ticks
    xAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });
    yAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Gas Make",
        xAxis,
        yAxis,
        valueYField: "gasmake",
        valueXField: "date",
        stroke: root.interfaceColors.get("primaryButton"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Gas Make: {valueY}",
        }),
      })
    );

    // ⭐ Make line bold
    series.strokes.template.setAll({
      strokeWidth: 3,
    });

    // ⭐ Add circle marker at each data point
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: series.get("stroke"),
          stroke: am5.color("#fff"),
          strokeWidth: 1,
        }),
      })
    );

    series.data.setAll(chartData);

    chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none" }));
    this.hasMake = true;
    this.loading = false;
    this.createPressureChartCob10(chartData);
  }

  createPressureChartCob10(chartData: any[]) {
    let root = am5.Root.new("cob10pressureChart1");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.set("forceHidden", true);

    // ⭐ Get CSS variable color
    let axisColor = getComputedStyle(document.body)
      .getPropertyValue("--charttext")
      .trim();
    console.log("axisColor =", axisColor);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    // ⭐ Add Horizontal Scrollbar
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        groupData: false,
      })
    );

    // Format labels
    xAxis.set("dateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    xAxis.set("tooltipDateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    // ⭐ Correct method
    xAxis.get("renderer").set("minGridDistance", 40);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // ⭐ APPLY COLOR TO AXIS LABELS + GRID
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });
    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });

    xAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });
    yAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });

    xAxis
      .get("renderer")
      .ticks.template.setAll({ stroke: am5.color(axisColor) });
    yAxis
      .get("renderer")
      .ticks.template.setAll({ stroke: am5.color(axisColor) });

    // ⭐ SERIES
    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Pressure",
        xAxis,
        yAxis,
        valueYField: "pressure",
        valueXField: "date",
        stroke: root.interfaceColors.get("primaryButtonHover"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Pressure: {valueY}",
        }),
      })
    );

    // ⭐ Make line bold
    series.strokes.template.setAll({
      strokeWidth: 3,
    });

    // ⭐ Add circle marker at each value
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: series.get("stroke"),
          stroke: am5.color("#fff"),
          strokeWidth: 1,
        }),
      })
    );

    series.data.setAll(chartData);

    // Cursor
    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );

    this.hasPressure = true;
    this.loading = false;
  }

  //*** COB#11  ***//
  getCob11Data() {
    this.trendService
      .cob11_trend({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          const data = JSON.parse(JSON.stringify(response));
          console.log(data);
          this.responseData = JSON.parse(JSON.stringify(response));

          if (data.length === 0) {
            this.hasMake = false;
            this.hasPressure = false;
          } else {
            // Prepare data for the chart
            const chartData = response.map((data: any) => ({
              date: new Date(data.datestamp).getTime(),
              gasmake: data.COGASMAKEPRESSURE,
              pressure: data.FT0600F003_C,
            }));

            // Create two charts
            this.createGasMakeChartCob11(chartData);
          }
        },
        error: (err) => {
          this._snackBar.open(err, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  createGasMakeChartCob11(chartData: any[]) {
    let root = am5.Root.new("cob11gasmakeChart1");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.set("forceHidden", true);

    // ⭐ Get CSS variable color
    let axisColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--charttext")
      .trim();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "zoomX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        groupData: false,
      })
    );

    // Format labels
    xAxis.set("dateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    xAxis.set("tooltipDateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    // ⭐ Correct method
    xAxis.get("renderer").set("minGridDistance", 40);
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // ⭐ APPLY COLOR TO AXIS LABELS
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });
    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });

    // ⭐ Optional: color grid lines + ticks
    xAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });
    yAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Gas Make",
        xAxis,
        yAxis,
        valueYField: "gasmake",
        valueXField: "date",
        stroke: root.interfaceColors.get("primaryButton"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Gas Make: {valueY}",
        }),
      })
    );

    // ⭐ Make line bold
    series.strokes.template.setAll({
      strokeWidth: 3,
    });

    // ⭐ Add circle marker at each data point
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: series.get("stroke"),
          stroke: am5.color("#fff"),
          strokeWidth: 1,
        }),
      })
    );

    series.data.setAll(chartData);

    chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none" }));
    this.hasMake = true;
    this.createPressureChartCob11(chartData);
  }

  createPressureChartCob11(chartData: any[]) {
    let root = am5.Root.new("cob11pressureChart1");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.set("forceHidden", true);

    // ⭐ Get CSS variable color
    let axisColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--charttext")
      .trim();

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    // ⭐ Add Horizontal Scrollbar
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        groupData: false,
      })
    );

    // Format labels
    xAxis.set("dateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    xAxis.set("tooltipDateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    // ⭐ Correct method
    xAxis.get("renderer").set("minGridDistance", 40);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // ⭐ APPLY COLOR TO AXIS LABELS + GRID
    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });
    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(axisColor),
    });

    xAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });
    yAxis
      .get("renderer")
      .grid.template.setAll({ stroke: am5.color(axisColor) });

    xAxis
      .get("renderer")
      .ticks.template.setAll({ stroke: am5.color(axisColor) });
    yAxis
      .get("renderer")
      .ticks.template.setAll({ stroke: am5.color(axisColor) });

    // ⭐ SERIES
    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Pressure",
        xAxis,
        yAxis,
        valueYField: "pressure",
        valueXField: "date",
        stroke: root.interfaceColors.get("primaryButtonHover"),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Pressure: {valueY}",
        }),
      })
    );

    // ⭐ Make line bold
    series.strokes.template.setAll({
      strokeWidth: 3,
    });

    // ⭐ Add circle marker at each value
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: series.get("stroke"),
          stroke: am5.color("#fff"),
          strokeWidth: 1,
        }),
      })
    );

    series.data.setAll(chartData);

    // Cursor
    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
      })
    );

    this.hasPressure = true;
    this.loading = false;
  }

  // Helper method to update chart data

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.sseoverview) this.sseoverview.unsubscribe();
    if (this.cob10overview) this.cob10overview.unsubscribe();
    // am5.disposeAllRootElements();
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
