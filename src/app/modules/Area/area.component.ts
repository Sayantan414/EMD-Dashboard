import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { SseService } from "app/services/sse.servece";
import { Subscription } from 'rxjs';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexStroke,
  ApexFill,
  ApexTooltip,
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
  selector: "app-dashboard",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"],
  standalone: true,
  imports: [ProjectCommonModule],
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


  make = 'C.O. GAS MAKE [Th. Nm³/hr]';
  pressure = 'C.O. GAS PRESSURE [mmwc]';
bv = 'BLAST VOLUME [Nm³/min]';
bp = 'BLAST PRESSURE [Kg/cm²]';

max_gasmake_cob10 = 80000;
max_gasmake_cob11 = 60000;
max_gasmake_bf5   = 50000;

max_pressure_cob10 = 4000;
max_pressure_cob11 = 3500;
max_pressure_bf5   = 10;


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

  constructor(private sseService: SseService) {}
  
  splitLetters(text: string): string[] {
    return text.split('').map((c) => (c === ' ' ? '\u00A0' : c));
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
            name: { show: true, fontSize: "18px", color: "var(--header_active)", offsetY: 10 },
            value: {
              show: false, // ✅ completely hide numeric value
            },
          },
        },
      },
      fill: { type: "gradient", gradient: { shade: "light", type: "horizontal", stops: [0, 100] } },
      stroke: { lineCap: "round" },
    };

    this.makeGauge1 = { ...baseGauge, labels: ["COB#10"]};
    this.makeGauge2 = { ...baseGauge, labels: ["COB#11"] };
    this.makeGauge3 = { ...baseGauge, labels: ["BF#5 KALYANI"] };
    this.pressureGauge1 = { ...baseGauge, labels: ["COB#10"] };
    this.pressureGauge2 = { ...baseGauge, labels: ["COB#11"] };
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
          if (isNaN(val))  this.cob10_res.benzol_scrubber_gasmake = 0;
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
          if (isNaN(val))  this.cob10_res.cogas_supply_pressure = 0;
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

    this.cob10overview = this.sseService.getOverview().subscribe((data: any) => {
      // console.log('Result', data);

      this.animateValue(
        this.previouscob10Values.MAKE,
        data.MAKE,
        800, // ms
        (val) => {
          if (isNaN(val))  this.overview_res.MAKE = 0;
          else this.overview_res.MAKE = val;
    
          // ✅ Update gauge
          const maxGasMake = this.max_gasmake_cob11 || 60000; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.makeGauge2.series = [percent];
        }
      );

      this.animateValue(
        this.previouscob10Values.PRESSURE,
        data.PRESSURE,
        800,
        (val) => {
          if (isNaN(val))  this.overview_res.PRESSURE = 0;
          else this.overview_res.PRESSURE = val;
    
          // ✅ Update pressure gauge
          const maxPressure = this.max_pressure_cob11 || 3500;
          const percent = Math.min((val / maxPressure) * 100, 100);
          this.pressureGauge2.series = [percent];
        },
        2
        
      );

      this.animateValue(
        this.previouscob10Values.BLAST_VOLUME,
        data.BLAST_VOLUME,
        800, // ms
        (val) => {
         
          if (isNaN(val))  this.overview_res.BLAST_VOLUME = 0;
          else this.overview_res.BLAST_VOLUME = val;
          

          // ✅ Update gauge
          const maxGasMake = this.max_gasmake_bf5 || 50000; // fallback if API doesn't send
          const percent = Math.min((val / maxGasMake) * 100, 100);
          this.makeGauge3.series = [percent];
        }
      );

      this.animateValue(
        this.previouscob10Values.BLAST_PRESSURE,
        data.BLAST_PRESSURE,
        800,
        (val) => {
          if (isNaN(val))  this.overview_res.BLAST_PRESSURE = 0;
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
  

  
  // Helper method to update chart data

  ngOnDestroy(): void {
        // Clean up subscription to prevent memory leaks
        if (this.sseoverview) this.sseoverview.unsubscribe();
        if (this.cob10overview) this.cob10overview.unsubscribe();
  }
}
