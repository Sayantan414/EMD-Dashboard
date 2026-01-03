import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { SseService } from "app/services/sse.servece";
import { TrendService } from "app/services/trend.service";
import { NgApexchartsModule } from "ng-apexcharts";
import { interval, startWith, Subject, Subscription, takeUntil } from "rxjs";
import { ActivatedRoute } from "@angular/router";

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ChartComponent,
} from "ng-apexcharts";

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
  selector: "app-gas-holder",
  standalone: true,
  imports: [ProjectCommonModule, NgApexchartsModule],
  templateUrl: "./gas-holder.component.html",
  styleUrl: "./gas-holder.component.scss",
})
export class GasHolderComponent implements OnInit {
  viewMode: string = "gasholder";
  // loading: boolean = true;
  hideViewModeSwitch = false;

  reportData: any[] = [];
  gaslevel = "Gas Level";
  ghp = "Gas Holder Pressure";
  gt = "Gas Temperature";
  gfm = "Gas Flow (Mills)";
  egpbs = "Exported Gas PBS";
  tldgm = "Totalizer LD Gas Mills (Nm3)";
  tldgpbs = "Totalizer LD Gas PBS (Nm3)";

  maxGasLevel = 30;

  max_GASHOLDERPRES = 300;
  max_GASHOLDERTEMP = 70;
  max_GAS_FLOW_mills = 30000;
  max_EXPORTEDGAS = 10000;
  max_Mills_totaliser = 2000000;
  max_PBS_MINUS_MILLS = 80000;

  gasholder_res = {
    GASHOLDERLVL: 0,
    GASHOLDERPRES: 0,
    GASHOLDERTEMP: 0,
    GAS_FLOW_mills: 0,
    EXPORTEDGAS: 0,
    Mills_totaliser: 0,
  };
  pbsMinusMills = 0;
  previousPBSMinusMills = 0;

  gasLevelClass: "gas-Warm" | "gas-purple" | "gas-red" = "gas-Warm";

  previousValues: any = { ...this.gasholder_res };

  private sseoverview?: Subscription;

  tempGauge: any = {
    series: [2.29], // live value here

    chart: {
      type: "radialBar",
      height: 300,
    },

    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#ffffff",
          strokeWidth: "90%",
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: -10,
            color: "var(--gauge-text)",
            fontSize: "17px",
            fontWeight: "600",
            formatter: () => "TEMPERATURE",
          },
          value: {
            show: false,
          },
        },
      },
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        gradientToColors: ["#ff99ff"], // 💗 pink right side
        stops: [0, 100],
      },
      colors: ["#000066"], // 🔵 dark blue left side
    },

    stroke: {
      lineCap: "round",
    },

    labels: ["TEMPERATURE"],
  };

  flowGauge: Partial<ChartOptions> = {
    series: [0],
    chart: {
      height: 230,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "70%",
        },
        track: {
          background: "#ffffff",
          strokeWidth: "90%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "17px",
            fontWeight: 600,
            color: "var(--gauge-text)",
            offsetY: 10,
          },
          value: {
            show: false,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["GAS FLOW"],
  };

  tldgmGauge: any = {
    series: [2.29], // live value here

    chart: {
      type: "radialBar",
      height: 300,
    },

    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#ffffff",
          strokeWidth: "90%",
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: -10,
            color: "var(--gauge-text)",
            fontSize: "17px",
            fontWeight: "600",
            formatter: () => "LD GAS MILLS",
          },
          value: {
            show: false,
          },
        },
      },
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        gradientToColors: ["#ff99ff"], // 💗 pink right side
        stops: [0, 100],
      },
      colors: ["#000066"], // 🔵 dark blue left side
    },

    stroke: {
      lineCap: "round",
    },

    labels: ["LD GAS MILLS"],
  };

  tldgPbsGauge: Partial<ChartOptions> = {
    series: [0],
    chart: {
      height: 230,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "70%",
        },
        track: {
          background: "#ffffff",
          strokeWidth: "90%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "17px",
            fontWeight: 600,
            color: "var(--gauge-text)",
            offsetY: 12,
          },
          value: {
            show: false, // ❌ value shown below, not inside gauge
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["LD GAS PBS"],
  };

  private _unsubscribeAll: Subject<any> = new Subject();
  public pressureGauge: Partial<ChartOptions>;
  public egpbsGauge: Partial<ChartOptions>;

  constructor(
    private sseService: SseService,
    private trendService: TrendService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
    this.pressureGauge = {
      series: [0],

      chart: {
        height: 228,
        type: "radialBar",
        offsetY: -10,
      },

      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            size: "65%",
          },
          track: {
            background: "#ffffff",
            strokeWidth: "90%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "17px",
              offsetY: 10,
              color: "var(--gauge-text)", // <-- Set color here, this is allowed
              fontWeight: "600", // <-- This is allowed too
              formatter: () => `PRESSURE`,
            },
          },
        },
      },

      fill: {
        type: "gradient",
        colors: ["#ff4d4d"],
        gradient: {
          shade: "light",
          type: "horizontal",
          gradientToColors: ["#ff0000"],
          stops: [0, 50, 100],
        },
      },

      stroke: {
        dashArray: 4,
      },

      labels: ["PRESSURE"],
    };

    this.egpbsGauge = {
      series: [0],

      chart: {
        height: 228,
        type: "radialBar",
        offsetY: -10,
      },

      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            size: "65%",
          },
          track: {
            background: "#ffffff",
            strokeWidth: "90%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "17px",
              offsetY: 10,
              color: "var(--gauge-text)", // <-- Set color here, this is allowed
              fontWeight: "600", // <-- This is allowed too
              formatter: () => `GAS PBS`,
            },
          },
        },
      },

      fill: {
        type: "gradient",
        colors: ["#ff4d4d"],
        gradient: {
          shade: "light",
          type: "horizontal",
          gradientToColors: ["#ff0000"],
          stops: [0, 50, 100],
        },
      },

      stroke: {
        dashArray: 4,
      },

      labels: ["GAS PBS"],
    };
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

  /** Clamp value between 0 and max */
  get gasFillPercent(): number {
    const value = Number(this.gasholder_res.GASHOLDERLVL) || 0;
    return Math.min(Math.max((value / this.maxGasLevel) * 100, 0), 100);
  }

  updateGasColor(value: number) {
    // const gasPercent = (value / this.maxGasLevel) * 100;
    // console.log(gasPercent);
    const gaslevelvalue = Number(this.gasholder_res.GASHOLDERLVL) || 0;

    if (gaslevelvalue < 10) {
      this.gasLevelClass = "gas-red";
    } else if (gaslevelvalue < 20) {
      this.gasLevelClass = "gas-purple";
    } else {
      this.gasLevelClass = "gas-Warm";
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["from"] === "dashboard") {
        this.hideViewModeSwitch = true;
        this.viewMode = "gasholder";
      } else {
        // 🔑 IMPORTANT: reset when not coming from dashboard
        this.hideViewModeSwitch = false;
      }
    });

    // this.loading = false;
    interval(60000) // 1 minute
      .pipe(
        startWith(0), // call immediately on load
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.getReportData();
      });
    this.sseoverview = this.sseService.getOverview().subscribe((data: any) => {
      // console.log("Response", data);

      // Animate each property

      this.animateValue(
        this.previousValues.GASHOLDERPRES,
        data.GASHOLDERPRES,
        800, // ms
        (val) => {
          if (isNaN(val)) this.gasholder_res.GASHOLDERPRES = 0;
          else this.gasholder_res.GASHOLDERPRES = val;

          // ✅ Update gauge
          const maxGasMake = this.max_GASHOLDERPRES || 300; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.pressureGauge.series = [percent];
        },
        2
      );

      this.animateValue(
        this.previousValues.GASHOLDERTEMP,
        data.GASHOLDERTEMP,
        800, // ms
        (val) => {
          if (isNaN(val)) this.gasholder_res.GASHOLDERTEMP = 0;
          else this.gasholder_res.GASHOLDERTEMP = val;

          // ✅ Update gauge
          const maxGasMake = this.max_GASHOLDERTEMP || 70; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.tempGauge.series = [percent];
        },
        2
      );

      this.animateValue(
        this.previousValues.GAS_FLOW_mills,
        data.GAS_FLOW_mills,
        800, // ms
        (val) => {
          if (isNaN(val)) this.gasholder_res.GAS_FLOW_mills = 0;
          else this.gasholder_res.GAS_FLOW_mills = val;

          // ✅ Update gauge
          const maxGasMake = this.max_GAS_FLOW_mills || 30000; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.flowGauge.series = [percent];
        },
        2
      );

      this.animateValue(
        this.previousValues.EXPORTEDGAS,
        data.EXPORTEDGAS,
        800, // ms
        (val) => {
          if (isNaN(val)) this.gasholder_res.EXPORTEDGAS = 0;
          else this.gasholder_res.EXPORTEDGAS = val;

          // ✅ Update gauge
          const maxGasMake = this.max_EXPORTEDGAS || 10000; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.egpbsGauge.series = [percent];
        },
        2
      );

      this.animateValue(
        this.previousValues.Mills_totaliser,
        data.Mills_totaliser,
        800, // ms
        (val) => {
          if (isNaN(val)) this.gasholder_res.Mills_totaliser = 0;
          else this.gasholder_res.Mills_totaliser = val;

          // ✅ Update gauge
          const maxGasMake = this.max_Mills_totaliser || 2000000; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.tldgmGauge.series = [percent];
        },
        2
      );

      // 🔵 PBS − MILLS (Derived animated value)
      this.animateValue(
        this.previousPBSMinusMills,
        Number(data?.PBS_totaliser || 0) - Number(data?.Mills_totaliser || 0),
        800,
        (val) => {
          if (isNaN(val)) {
            this.pbsMinusMills = 0;
          } else {
            this.pbsMinusMills = val;
          }

          // ✅ Update radial gauge (use absolute or clamp if needed)
          const maxDiff = this.max_PBS_MINUS_MILLS || 80000; // define sensible max
          const percent = Math.min((Math.abs(val) / maxDiff) * 100, 100);

          this.tldgPbsGauge.series = [percent];
        },
        2
      );

      this.animateValue(
        this.previousValues.GASHOLDERLVL,
        data.GASHOLDERLVL,
        800,
        (val) => {
          this.gasholder_res.GASHOLDERLVL = val;
          this.updateGasColor(val); // ✅ ADD THIS
        },
        2
      );
      // Update previous values for next round
      this.previousValues = { ...data };
      this.previousPBSMinusMills =
        Number(data?.PBS_totaliser || 0) - Number(data?.Mills_totaliser || 0);
    });

    this.getReportData();
  }

  onViewModeChange() {
    if (this.viewMode === "trends") {
      // this.loading = true;
    }
  }

  getReportData() {
    this.trendService
      .bof_holder_trend({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res: any[]) => {
          this.prepareReportTable(res);
        },
        error: (err) => {
          this._snackBar.open(err, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  private to2Decimal(val: any): string {
    if (val === null || val === undefined || isNaN(val)) {
      return "0.00";
    }
    return Number(val).toFixed(2);
  }

  prepareReportTable(data: any[]) {
    this.reportData = data.map((item) => {
      // Treat timestamp as LOCAL
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

        GASHOLDERLVL: this.to2Decimal(item.GASHOLDERLVL),
        GASHOLDERPRES: this.to2Decimal(item.GASHOLDERPRES),
        GASHOLDERTEMP: this.to2Decimal(item.GASHOLDERTEMP),
        EXPORTEDGAS: this.to2Decimal(item.EXPORTEDGAS),

        GAS_FLOW_mills: this.to2Decimal(item.GAS_FLOW_mills),
        Mills_totaliser: this.to2Decimal(item.Mills_totaliser),
        PBS_totaliser: this.to2Decimal(item.PBS_totaliser),

        a_mills_totaliser: this.to2Decimal(item.a_mills_totaliser),
        b_mills_totaliser: this.to2Decimal(item.b_mills_totaliser),
        c_mills_totaliser: this.to2Decimal(item.c_mills_totaliser),

        a_pbs_totaliser: this.to2Decimal(item.a_pbs_totaliser),
        b_pbs_totaliser: this.to2Decimal(item.b_pbs_totaliser),
        c_pbs_totaliser: this.to2Decimal(item.c_pbs_totaliser),

        SHIFT_A: this.to2Decimal(item.SHIFT_A),
        SHIFT_B: this.to2Decimal(item.SHIFT_B),
        SHIFT_C: this.to2Decimal(item.SHIFT_C),
      };
    });
    // this.loading = false;
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.sseoverview) {
      this.sseoverview.unsubscribe();
    }

    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
