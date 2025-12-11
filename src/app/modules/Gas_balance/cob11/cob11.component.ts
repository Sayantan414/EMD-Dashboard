import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { SseService } from "app/services/sse.servece";
import { TrendService } from "app/services/trend.service";
import { interval, startWith, Subject, Subscription, takeUntil } from "rxjs";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: "app-cob11",
  templateUrl: "./cob11.component.html",
  styleUrls: ["./cob11.component.scss"],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class Cob11Component implements OnInit {
  cogasflow_res = {
    FT0600F003_C: 0,
    COGASMAKEPRESSURE: 0,
    COB10_GASMAKEF: 0,
    COB10_COGSUPPLY: 0,
    COFLARESTACKFLOW: 0,
    COFLARESTACKPRESSURE: 0,
    CO_GAS1_F: 0,
    CO_GAS2_F: 0,
    PBS_BCOGF: 0,
    BF_COF: 0,
    SP_CO_GAS: 0,
    COG_FLOW_GMS: 0,
  };
  boosterValue = {
    AGBS_inletP_b1: 0,
    AGBS_inletP_b2: 0,
    AGBS_outletF: 0,
    AGBS_outletP_b1: 0,
    AGBS_outletP_b2: 0,
    CGBS_inletP_b1: 0,
    CGBS_inletP_b2: 0,
    CGBS_outletF_b1: 0,
    CGBS_outletF_b2: 0,
    CGBS_outletP_b1: 0,
    CGBS_outletP_b2: 0,
  };
  previousValues: any = { ...this.cogasflow_res };
  previousboosterValues: any = { ...this.boosterValue };

  private sseoverview?: Subscription;
  private ssebooster?: Subscription;

  viewMode: string = "flow"; // default selected: CO Gas Flow
  reportData: any[] = [];
  chartSeries: any[] = [];
  chartOptions: any = {};
  loading: boolean = true;

  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerOpened: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private sseService: SseService,
    private trendService: TrendService,
    private _snackBar: MatSnackBar
  ) {
    this._unsubscribeAll = new Subject();
  }

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
  onViewModeChange() {
    if (this.viewMode === "trends") {
      this.loading = true;
      this.getReportData();
    }
  }

  ngOnInit(): void {
    interval(60000) // 1 minute
      .pipe(
        startWith(0), // call immediately on load
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.getReportData();
      });
    this.sseoverview = this.sseService.getOverview().subscribe((data: any) => {
      // console.log('es', data);
      // console.log(this.bf5_res);

      // Animate each property
      //sourav code
      this.animateValue(
        this.previousValues.FT0600F003_C,
        data.FT0600F003_C,
        800,
        (val) => (this.cogasflow_res.FT0600F003_C = val)
      );

      this.animateValue(
        this.previousValues.COGASMAKEPRESSURE,
        data.COGASMAKEPRESSURE,
        800, // ms
        (val) => (this.cogasflow_res.COGASMAKEPRESSURE = val)
      );

      this.animateValue(
        this.previousValues.COB10_GASMAKEF,
        data.COB10_GASMAKEF,
        800,
        (val) => (this.cogasflow_res.COB10_GASMAKEF = val)
      );

      // repeat for other props
      this.animateValue(
        this.previousValues.COB10_COGSUPPLY,
        data.COB10_COGSUPPLY,
        800,
        (val) => (this.cogasflow_res.COB10_COGSUPPLY = val)
      );

      this.animateValue(
        this.previousValues.COFLARESTACKFLOW,
        data.COFLARESTACKFLOW,
        800,
        (val) => (this.cogasflow_res.COFLARESTACKFLOW = val)
      );

      this.animateValue(
        this.previousValues.COFLARESTACKPRESSURE,
        data.COFLARESTACKPRESSURE,
        800,
        (val) => (this.cogasflow_res.COFLARESTACKPRESSURE = val)
      );
      //sourav code

      this.animateValue(
        this.previousValues.CO_GAS1_F,
        data.CO_GAS1_F,
        800, // ms
        (val) => (this.cogasflow_res.CO_GAS1_F = val)
      );

      this.animateValue(
        this.previousValues.CO_GAS2_F,
        data.CO_GAS2_F,
        800,
        (val) => (this.cogasflow_res.CO_GAS2_F = val)
      );

      // repeat for other props
      this.animateValue(
        this.previousValues.PBS_BCOGF,
        data.PBS_BCOGF,
        800,
        (val) => (this.cogasflow_res.PBS_BCOGF = val)
      );

      this.animateValue(
        this.previousValues.BF_COF,
        data.BF_COF,
        800,
        (val) => (this.cogasflow_res.BF_COF = val)
      );

      this.animateValue(
        this.previousValues.SP_CO_GAS,
        data.SP_CO_GAS,
        800,
        (val) => (this.cogasflow_res.SP_CO_GAS = val)
      );

      this.animateValue(
        this.previousValues.COG_FLOW_GMS,
        data.COG_FLOW_GMS,
        800, // ms
        (val) => (this.cogasflow_res.COG_FLOW_GMS = val)
      );

      // Update previous values for next round
      this.previousValues = { ...data };
    });

    this.ssebooster = this.sseService.getBooster().subscribe((data: any) => {
      // console.log('es', data);
      // console.log(this.bf5_res);

      // Animate each property
      //sourav code
      this.animateValue(
        this.previousboosterValues.AGBS_inletP_b1,
        data.AGBS_inletP_b1,
        800,
        (val) => (this.boosterValue.AGBS_inletP_b1 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.AGBS_inletP_b2,
        data.AGBS_inletP_b2,
        800, // ms
        (val) => (this.boosterValue.AGBS_inletP_b2 = val)
      );

      this.animateValue(
        this.previousboosterValues.AGBS_outletF,
        data.AGBS_outletF,
        800,
        (val) => (this.boosterValue.AGBS_outletF = val),
        2
      );

      // repeat for other props
      this.animateValue(
        this.previousboosterValues.AGBS_outletP_b1,
        data.AGBS_outletP_b1,
        800,
        (val) => (this.boosterValue.AGBS_outletP_b1 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.AGBS_outletP_b2,
        data.AGBS_outletP_b2,
        800,
        (val) => (this.boosterValue.AGBS_outletP_b2 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.CGBS_inletP_b1,
        data.CGBS_inletP_b1,
        800,
        (val) => (this.boosterValue.CGBS_inletP_b1 = val),
        2
      );
      //sourav code

      this.animateValue(
        this.previousboosterValues.CGBS_inletP_b2,
        data.CGBS_inletP_b2,
        800, // ms
        (val) => (this.boosterValue.CGBS_inletP_b2 = val)
      );

      this.animateValue(
        this.previousboosterValues.CGBS_outletF_b1,
        data.CGBS_outletF_b1,
        800,
        (val) => (this.boosterValue.CGBS_outletF_b1 = val),
        2
      );

      // repeat for other props
      this.animateValue(
        this.previousboosterValues.CGBS_outletF_b2,
        data.CGBS_outletF_b2,
        800,
        (val) => (this.boosterValue.CGBS_outletF_b2 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.CGBS_outletP_b1,
        data.CGBS_outletP_b1,
        800,
        (val) => (this.boosterValue.CGBS_outletP_b1 = val),
        2
      );

      this.animateValue(
        this.previousboosterValues.CGBS_outletP_b2,
        data.CGBS_outletP_b2,
        800,
        (val) => (this.boosterValue.CGBS_outletP_b2 = val),
        2
      );

      // Update previous values for next round
      this.previousboosterValues = { ...data };
    });
  }

  getReportData() {
    this.trendService
      .cob11_cog_trend({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res: any[]) => {
          this.prepareReportTable(res);

          // Prepare data for the chart
          const chartData = res.map((d: any) => ({
            date: new Date(d.datestamp).getTime(),

            FT0600F003_C: d.FT0600F003_C,
            UFGasFlow: d.CO_GAS1_F + d.CO_GAS2_F,
            PBS_BCOGF: d.PBS_BCOGF,
            BF_COF: d.BF_COF,
            SP_CO_GAS: d.SP_CO_GAS,
            COG_FLOW_GMS: d.COG_FLOW_GMS,
            COFLARESTACKFLOW: d.COFLARESTACKFLOW,
          }));

          setTimeout(() => {
            this.prepareChart(chartData);
          }, 50);
        },
        error: (err) => {
          this._snackBar.open(err, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  prepareReportTable(data: any[]) {
    this.reportData = data.map((item) => {
      // Force JS to treat the timestamp as LOCAL (not UTC)
      const d = new Date(item.datestamp.replace("Z", ""));

      return {
        date: d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),

        time: d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),

        bppFlow: item.FT0600F003_C,
        bppPressure: item.COGASMAKEPRESSURE,

        uftotal: (item.CO_GAS1_F ?? 0) + (item.CO_GAS2_F ?? 0),

        pbsFlow: item.PBS_BCOGF,
        bf5Flow: item.BF_COF,
        bf5Pressure: "N/A",

        millsFlow: "N/A",
        millsPressure: "N/A",

        sinterFlow: item.SP_CO_GAS,
        sinterPressure: "N/A",

        bofFlow: "N/A",
        bofPressure: "N/A",

        ccpFlow: "N/A",
        ccpPressure: "N/A",

        ldcpFlow: item.COG_FLOW_GMS,
        ldcpPressure: "N/A",

        flareFlow: item.COFLARESTACKFLOW,
        flarePressure: item.COFLARESTACKPRESSURE,

        lossesFlow: "N/A",
        lossesPressure: "N/A",
      };
    });
  }

  prepareChart(chartData: any[]) {
    let root = am5.Root.new("trend");
    root.setThemes([am5themes_Animated.new(root)]);
    root._logo.set("forceHidden", true);

    let axisColor = "#ffffff";

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
        groupData: false,
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    xAxis.set("dateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    xAxis.set("tooltipDateFormats", {
      minute: "HH:mm",
      hour: "HH:mm",
    });

    xAxis.get("renderer").set("minGridDistance", 40);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Axis colors
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

    // 🔥 SERIES CONFIG FUNCTION (to avoid repeating code)
    const createSeries = (name: string, field: string, color: string) => {
      let series = chart.series.push(
        am5xy.LineSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          valueXField: "date",
          stroke: am5.color(color),
          tooltip: am5.Tooltip.new(root, {
            labelText: `${name}: {valueY.formatNumber('#.00')}`,
          }),
          
        })
      );

      series.strokes.template.setAll({
        strokeWidth: 3,
      });

      // series.bullets.push(() =>
      //   am5.Bullet.new(root, {
      //     sprite: am5.Circle.new(root, {
      //       radius: 4,
      //       fill: series.get("stroke"),
      //       stroke: am5.color("#fff"),
      //       strokeWidth: 1,
      //     }),
      //   })
      // );

      // let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      //   behavior: "none"
      // }));

      // cursor.lineX.set("visible", false);
      // cursor.lineY.set("visible", false);

      // // Enable snapping tooltip to closest line / bullet
      // cursor.set("snapToSeries", chart.series.values);
      // cursor.set("snapToSeriesBy", "closest");

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 4,
            fill: series.get("stroke"),
            stroke: am5.color("#fff"),
            strokeWidth: 1,
            // tooltipText: `${name}: {valueY.formatNumber('#.00')}`,

          }),
        })
      );

      series.data.setAll(chartData);
    };

    // 🔥 NOW CREATE ALL 7 SERIES
    createSeries("BPP FLOW", "FT0600F003_C", "#00CED1");
    createSeries("U/F TOTAL FLOW", "UFGasFlow", "#FFA500");
    createSeries("PBS FLOW", "PBS_BCOGF", "#FFA500");
    createSeries("BF-5 FLOW", "BF_COF", "#FFA500");
    createSeries("SINTER FLOW", "SP_CO_GAS", "#FFA500");
    createSeries("LDCP FLOW", "COG_FLOW_GMS", "#FFA500");
    createSeries("FLARE STACK FLOW", "COFLARESTACKFLOW", "#FFA500");

    chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none" }));
    let cursor = chart.get("cursor");

    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    // Enable tooltip on bullets
    cursor.set("snapToSeries", chart.series.values);

    this.loading = false;
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.sseoverview) {
      this.sseoverview.unsubscribe();
    }
    if (this.ssebooster) {
      this.ssebooster.unsubscribe();
    }

    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
