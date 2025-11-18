import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { Router } from "@angular/router";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { TrendService } from "app/services/trend.service";
import { Subject, takeUntil } from "rxjs";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: "app-cob10",
  templateUrl: "./cob10.component.html",
  styleUrls: ["./cob10.component.css"],
  standalone: true,
  imports: [ProjectCommonModule, CommonModule],
})
export class Cob10Component implements OnInit {
  cob10 = "COB#10";
  private root!: am5.Root;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    //  private router: Router,
    public matDialogRef: MatDialogRef<Cob10Component>,
    private trendService: TrendService,
    private _snackBar: MatSnackBar
  ) {
    this._unsubscribeAll = new Subject();
    this.getCob10Data();
  }
  splitLetters(text: string): string[] {
    return text.split("").map((c) => (c === " " ? "\u00A0" : c));
  }

  ngOnInit() {}
  ngOnDestroy() {
    am5.disposeAllRootElements();
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  // goBack() {
  //   // this.router.navigate(['/overview']);

  // }a

  getCob10Data() {
    this.trendService
      .cob10_trend({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          const data = JSON.parse(JSON.stringify(response));
          console.log(data);

          // Prepare data for the chart
          const chartData = response.map((data: any) => ({
            date: new Date(data.datestamp).getTime(),
            gasmake: data.benzol_scrubber_gasmake,
            pressure: data.cogas_supply_pressure,
            gasflow: data.cog_gasflow,
          }));

          console.log(chartData);

          this.createChart(chartData);
        },
        error: (err) => {
          this._snackBar.open(err, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  createChart(chartData: any[]) {
    this.root = am5.Root.new("cob10Chart");
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    // ⭐ TOP CONTAINER (Legend)
    const topContainer = this.root.container.children.push(
      am5.Container.new(this.root, {
        width: am5.percent(100),
        layout: this.root.horizontalLayout,
        paddingTop: 0,
        paddingBottom: 10,
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // ⭐ Legend ABOVE chart
    const legend = topContainer.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // ⭐ Main Chart BELOW legend
    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingTop: 50, // chart slightly down
      })
    );

    // X Axis
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(this.root, {
        baseInterval: { timeUnit: "second", count: 1 },
        renderer: am5xy.AxisRendererX.new(this.root, {}),
        groupData: false,
      })
    );

    // Y Axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
      })
    );

    // 🎨 COLORS
    const gasMakeColor = am5.color("#2979FF"); // blue
    const pressureColor = am5.color("#FF7043"); // orange

    // 🔵 Series 1 – GAS MAKE
    let gasMakeSeries = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: "C.O. GAS MAKE",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "gasmake",
        valueXField: "date",
        stroke: gasMakeColor,
      })
    );
    gasMakeSeries.strokes.template.setAll({
      strokeWidth: 2,
      stroke: gasMakeColor,
    });

    // ⭐ FIX LEGEND COLOR FOR GAS MAKE
    gasMakeSeries.events.on("datavalidated", () => {
      let marker = gasMakeSeries.get("legendDataItem")?.get("marker");
      if (marker) {
        marker.get("background")?.setAll({
          fill: gasMakeColor,
          stroke: gasMakeColor,
        });
      }
    });

    // 🟠 Series 2 – PRESSURE
    let pressureSeries = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: "C.O. GAS PRESSURE",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "pressure",
        valueXField: "date",
        stroke: pressureColor,
      })
    );
    pressureSeries.strokes.template.setAll({
      strokeWidth: 2,
      stroke: pressureColor,
    });

    // ⭐ FIX LEGEND COLOR FOR PRESSURE
    pressureSeries.events.on("datavalidated", () => {
      let marker = pressureSeries.get("legendDataItem")?.get("marker");
      if (marker) {
        marker.get("background")?.setAll({
          fill: pressureColor,
          stroke: pressureColor,
        });
      }
    });

    // Set data
    gasMakeSeries.data.setAll(chartData);
    pressureSeries.data.setAll(chartData);

    // ⭐ Legend shows series colors
    legend.data.setAll(chart.series.values);
  }
}
