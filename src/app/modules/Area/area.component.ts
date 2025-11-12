import { Component, OnInit, ViewChild } from "@angular/core";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { SseService } from "app/services/sse.servece";

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
};


@Component({
  selector: "app-dashboard",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class AreaComponent implements OnInit {
  makeGauge!: Partial<ChartOptions>;
  pressureGauge!: Partial<ChartOptions>;

  
  

  cob10_res = {
    benzol_scrubber_gasmake: 0,
    cogas_supply_pressure: 0,
    max_gasmake: 2000,  // fallback default
    max_pressure: 1000  // fallback default
  };

  constructor(private sseService: SseService) {}
  
  splitLetters(text: string): string[] {
    return text.split('').map((c) => (c === ' ' ? '\u00A0' : c));
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
            name: { show: true, fontSize: "14px", color: "#333", offsetY: 60 },
            value: {
              show: true,
              fontSize: "22px",
              formatter: (val: number) => `${val.toFixed(1)}%`,
            },
          },
        },
      },
      fill: { type: "gradient", gradient: { shade: "light", type: "horizontal", stops: [0, 100] } },
      stroke: { lineCap: "round" },
    };

    this.makeGauge = { ...baseGauge, labels: ["C.O. GAS MAKE"] };
    this.pressureGauge = { ...baseGauge, labels: ["C.O. GAS PRESSURE"] };
  }

  loadData() {
    this.sseService.getcob10().subscribe((data: any) => {
      this.cob10_res = data;
  
      // ✅ Ensure all values are numbers and define safe defaults
      const gasMake = Number(data.benzol_scrubber_gasmake) || 0;
      const pressure = Number(data.cogas_supply_pressure) || 0;
  
      // ✅ If API doesn’t provide max values, use sensible defaults
      const maxGasMake = Number(data.max_gasmake) || 30000; // default 30,000
      const maxPressure = Number(data.max_pressure) || 1000; // default 1,000
  
      // ✅ Calculate percentage (0–100 range)
      const makePercent = Math.min((gasMake / maxGasMake) * 100, 100);
      const pressurePercent = Math.min((pressure / maxPressure) * 100, 100);
  
      // ✅ Update gauges
      this.makeGauge.series = [parseFloat(makePercent.toFixed(2))];
      this.pressureGauge.series = [parseFloat(pressurePercent.toFixed(2))];
    });
  }
  

  
  // Helper method to update chart data

  ngOnDestroy(): void {}
}
