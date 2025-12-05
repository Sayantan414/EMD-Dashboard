import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';
import { TrendService } from 'app/services/trend.service';
import { Subject, takeUntil } from 'rxjs';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-bf5',
  standalone: true,
  imports: [ProjectCommonModule, CommonModule],
  templateUrl: './bf5.component.html',
  styleUrl: './bf5.component.scss'
})
export class Bf5Component {
  bf = "BF#5 KALYANI";
  private root!: am5.Root;
  responseData: any = [];
  hasMake: boolean = true;
  hasPressure: boolean = true;
  loading: boolean = true;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    public matDialogRef: MatDialogRef<Bf5Component>,
    private trendService: TrendService,
    private _snackBar: MatSnackBar
  ) {
    this._unsubscribeAll = new Subject();
    this.getbf5Data();
  }
  splitLetters(text: string): string[] {
    return text.split("").map((c) => (c === " " ? "\u00A0" : c));
  }
  ngOnInit() { }
  ngOnDestroy() {
    am5.disposeAllRootElements();
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  getbf5Data() {
    this.trendService
      .fourhourtrend({})
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
              volume: data.BLAST_VOLUME,
              pressure: data.BLAST_PRESSURE,
            }));

            // Create two charts

            setTimeout(() => {
              this.createGasMakeChart(chartData);
            }, 200);
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

  createGasMakeChart(chartData: any[]) {
    let root = am5.Root.new("bf5volumeChart");
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
        name: "Blast Volume",
        xAxis,
        yAxis,
        valueYField: "volume",
        valueXField: "date",
        stroke: am5.color(0xffa500),
        tooltip: am5.Tooltip.new(root, {
          labelText: "Blast Volume: {valueY}",
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
          stroke: am5.color("#f7d600ff"),
          strokeWidth: 1,
        }),
      })
    );

    series.data.setAll(chartData);

    chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none" }));
    this.hasMake = true;
    this.createPressureChart(chartData);
  }

  createPressureChart(chartData: any[]) {
    let root = am5.Root.new("bf5pressureChart");
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
        stroke: am5.color(0x90007af6),
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
          stroke: am5.color("#5a014df6"),
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
}
