import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { SseService } from "app/services/sse.servece";
import { TrendService } from "app/services/trend.service";
import { NgApexchartsModule } from "ng-apexcharts";
import { interval, startWith, Subject, Subscription, takeUntil } from "rxjs";
@Component({
  selector: "app-gas-holder",
  standalone: true,
  imports: [ProjectCommonModule, NgApexchartsModule],
  templateUrl: "./gas-holder.component.html",
  styleUrl: "./gas-holder.component.scss",
})
export class GasHolderComponent implements OnInit {
  viewMode: string = "gasholder";
  loading: boolean = true;
  reportData: any[] = [];
  gaslevel = "Gas Level";
  maxGasLevel = 30;
  gasholder_res = {
    GASHOLDERLVL: 0,
    GASHOLDERPRES: 0,
    GASHOLDERTEMP: 0,
    GAS_FLOW_mills: 0
  };
  gasLevelClass: 'gas-green' | 'gas-yellow' | 'gas-red' = 'gas-green';

  previousValues: any = { ...this.gasholder_res };
  private sseoverview?: Subscription;

  pressureSeries = [{ name: 'Pressure', data: [] }];
tempSeries     = [{ name: 'Temperature', data: [] }];
flowSeries     = [{ name: 'Gas Flow', data: [] }];

miniChart = {
  type: 'area',
  height: 120,
  sparkline: { enabled: true },
  animations: { enabled: true }
};

stroke = {
  curve: 'smooth',
  width: 2
};

xAxis = {
  type: 'datetime'
};

tooltip = {
  theme: 'dark'
};

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
      this.gasLevelClass = 'gas-red';
    } else if (gaslevelvalue < 20) {
      this.gasLevelClass = 'gas-yellow';
    } else {
      this.gasLevelClass = 'gas-green';
    }
  }
  
  ngOnInit() {
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
      console.log("Response", data);
      const time = new Date().getTime();

      // Update values
      this.gasholder_res.GASHOLDERPRES = data.GASHOLDERPRES;
      this.gasholder_res.GASHOLDERTEMP = data.GASHOLDERTEMP;
      this.gasholder_res.GAS_FLOW_mills = data.GAS_FLOW_mills;
    
      // Push data to charts (keep last 20 points)
      this.pressureSeries = [{
        name: 'Pressure',
        data: [...this.pressureSeries[0].data, [time, data.GASHOLDERPRES]].slice(-20)
      }];
      
      this.tempSeries = [{
        name: 'Temperature',
        data: [...this.tempSeries[0].data, [time, data.GASHOLDERTEMP]].slice(-20)
      }];
      
      this.flowSeries = [{
        name: 'Gas Flow',
        data: [...this.flowSeries[0].data, [time, data.GAS_FLOW_mills]].slice(-20)
      }];
      
    
      this.pressureSeries[0].data.splice(0, this.pressureSeries[0].data.length - 20);
      this.tempSeries[0].data.splice(0, this.tempSeries[0].data.length - 20);
      this.flowSeries[0].data.splice(0, this.flowSeries[0].data.length - 20);

      // Animate each property
      //sourav code
      this.animateValue(
        this.previousValues.GASHOLDERLVL,
        data.GASHOLDERLVL,
        800,
        (val) => {
          this.gasholder_res.GASHOLDERLVL = val;
          this.updateGasColor(val);   // ✅ ADD THIS
        },
        2
      );
      // Update previous values for next round
      this.previousValues = { ...data };
    });

    this.getReportData();
  }

  onViewModeChange() {
    if (this.viewMode === "trends") {
      this.loading = true;
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
    this.loading = false;
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
