import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';
import { SseService } from 'app/services/sse.servece';
import { TrendService } from 'app/services/trend.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-gas-holder',
  standalone: true,
  imports: [ProjectCommonModule],
  templateUrl: './gas-holder.component.html',
  styleUrl: './gas-holder.component.scss'
})
export class GasHolderComponent implements OnInit {
  viewMode: string = "report";
  loading: boolean = true;
  reportData: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject();


  constructor(
    private sseService: SseService,
    private trendService: TrendService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    // this.loading = false;
    this.getReportData();
  }

  onViewModeChange() {alert('1')
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
          console.log(res);

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
      return '0.00';
    }
    return Number(val).toFixed(2);
  }


  prepareReportTable(data: any[]) {
    this.reportData = data.map((item) => {
      // Treat timestamp as LOCAL
      const d = new Date(item.datestamp.replace('Z', ''));

      return {
        date: d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),

        time: d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
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


}
