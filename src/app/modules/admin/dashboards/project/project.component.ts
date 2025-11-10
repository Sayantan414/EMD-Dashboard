import { CurrencyPipe, NgClass, NgFor, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatRowDef, MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { ProjectService } from "app/modules/admin/dashboards/project/project.service";
import { CommonService } from "app/services/common.service";
import { OrganizationService } from "app/services/organization.service";
import { ProductionService } from "app/services/production.service";
import { UserService } from "app/services/user.service";
import { Subject, takeUntil } from "rxjs";
import {
  ApexOptions,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
} from "ng-apexcharts";
import { DispatchService } from "app/services/dispatch.service";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";
import { PlantperformanceService } from "app/services/plantperformance.service";
import { ActualQualitiesService } from "app/services/actual-qualities.service";
import { MinesService } from "app/services/mines.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RakeplanService } from "app/services/rakeplan.service";
import * as moment from "moment";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { LicminemineralsService } from "app/services/licmineminerals.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: "project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"],
  standalone: true,
  imports: [
    ProjectCommonModule,
    TranslocoModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    NgFor,
    NgIf,
    MatTableModule,
  ],
})
export class ProjectComponent implements OnInit, OnDestroy {
  chartGithubIssues: ApexOptions = {};
  chartTaskDistribution: ApexOptions = {};
  chartBudgetDistribution: ApexOptions = {};
  chartWeeklyExpenses: ApexOptions = {};
  chartMonthlyExpenses: ApexOptions = {};
  chartYearlyExpenses: ApexOptions = {};
  groupWiseProdChat: ApexOptions = {};
  data: any;
  selectedProject: string = "ACME Corp. Backend App";
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  filterJson = {
    date: null,
  };

  //sourav code
  filtercriteria = {
    start: this.getYesterdayDate(),
    end: this.getYesterdayDate(),
  };

  minEndDate!: Date;
  maxEndDate!: Date;
  //sourav code

  today: Date = new Date();

  // Get the previous day
  previousDay: Date = new Date(this.today);
  previousDayFormatted: string;

  MineStatutoryTree = [];
  minesgroup = [];
  minesID = [];
  MineStatutory = {};

  criteria = { Mine_Group: "", MINE_ID: "" };

  user: any;
  currentUser: any;
  organizationData = { oname: "", logo: "", logoURL: "" };
  countWidget = {
    total_lump_prod: 0,
    total_fines_prod: 0,
    total_production: 0,
    total_wgc_lump: 0,
    total_wgc_fines: 0,
    total_wgc_production: 0,
  };

  groupWiseProd = [];
  groupwiseprodchartOptions = [];
  groupwisedischartOptions = [];

  totalHotMetal: number = 0;
  totalSinter: number = 0;

  totalRakePlan: number = 0;
  totalDispatchActual: number = 0;
  totalDispatchAvg: number = 0;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  performancechart = [];
  performancebarchartOptions1: ApexOptions = {};
  performancebarchartOptions2: ApexOptions = {};
  linechartOptions1: ApexOptions = {};
  linechartOptions2: ApexOptions = {};
  minecluster = [];

  dhobil_lease_id: string = "";
  dhobil_lease_validity: string = "";
  dhobil_ec_validity: string = "";
  dhobil_install_cap: string = "";
  dhobil_status: string = "";

  duarguiburu_lease_id: string = "";
  duarguiburu_lease_validity: string = "";
  duarguiburu_ec_validity: string = "";
  duarguiburu_install_cap: string = "";
  duarguiburu_status: string = "";

  topailore_lease_id: string = "";
  topailore_lease_validity: string = "";
  topailore_ec_validity: string = "";
  topailore_install_cap: string = "";
  topailore_status: string = "";

  kiriburu_lease_id: string = "";
  kiriburu_lease_validity: string = "";
  kiriburu_ec_validity: string = "";
  kiriburu_install_cap: string = "";
  kiriburu_status: string = "";

  meghahatuburu_lease_id: string = "";
  meghahatuburu_lease_validity: string = "";
  meghahatuburu_ec_validity: string = "";
  meghahatuburu_install_cap: string = "";
  meghahatuburu_status: string = "";

  barsua_lease_id = "";
  barsua_lease_validity = "";
  barsua_ec_validity = "";
  barsua_install_cap = "";
  barsua_status = "";

  // Bolani Mine
  bolani_lease_id = "";
  bolani_lease_validity = "";
  bolani_ec_validity = "";
  bolani_install_cap = "";
  bolani_status = "";

  // Kalta Mine
  kalta_lease_id = "";
  kalta_lease_validity = "";
  kalta_ec_validity = "";
  kalta_install_cap = "";
  kalta_status = "";

  // Taldih Mine
  taldih_lease_id = "";
  taldih_lease_validity = "";
  taldih_ec_validity = "";
  taldih_install_cap = "";
  taldih_status = "";

  // Dalli Mine
  dalli_lease_id = "";
  dalli_lease_validity = "";
  dalli_ec_validity = "";
  dalli_install_cap = "";
  dalli_status = "";

  // Jharandalli Mine
  jharandalli_lease_id = "";
  jharandalli_lease_validity = "";
  jharandalli_ec_validity = "";
  jharandalli_install_cap = "";
  jharandalli_status = "";

  // Kalwar Nagur Mine
  kalwar_nagur_lease_id = "";
  kalwar_nagur_lease_validity = "";
  kalwar_nagur_ec_validity = "";
  kalwar_nagur_install_cap = "";
  kalwar_nagur_status = "";

  // Mahamaya-Dulki Mine
  mahamaya_dulk_lease_id = "";
  mahamaya_dulk_lease_validity = "";
  mahamaya_dulk_ec_validity = "";
  mahamaya_dulk_install_cap = "";
  mahamaya_dulk_status = "";

  // Rajhara Mine
  rajhara_lease_id = "";
  rajhara_lease_validity = "";
  rajhara_ec_validity = "";
  rajhara_install_cap = "";
  rajhara_status = "";

  // Rowghat Mine
  rowghat_lease_id = "";
  rowghat_lease_validity = "";
  rowghat_ec_validity = "";
  rowghat_install_cap = "";
  rowghat_status = "";

  m_bolani_lease_id = "";
  m_bolani_lease_validity = "";
  m_bolani_ec_validity = "";
  m_bolani_install_cap = "";
  m_bolani_status = "";

  // Gua Mine - Jhillingburu-I
  gua_jhillingburu1_lease_id = "";
  gua_jhillingburu1_lease_validity = "";
  gua_jhillingburu1_ec_validity = "";
  gua_jhillingburu1_install_cap = "";
  gua_jhillingburu1_status = "";

  // Gua Mine - Jhillingburu-II
  gua_jhillingburu2_lease_id = "";
  gua_jhillingburu2_lease_validity = "";
  gua_jhillingburu2_ec_validity = "";
  gua_jhillingburu2_install_cap = "";
  gua_jhillingburu2_status = "";

  hirri_lease_id = "";
  hirri_lease_validity = "";
  hirri_ec_validity = "";
  hirri_install_cap = "";
  hirri_status = "";

  // Kuteshwar Mine - Right Bank
  kuteshwar_right_lease_id = "";
  kuteshwar_right_lease_validity = "";
  kuteshwar_right_ec_validity = "";
  kuteshwar_right_install_cap = "";
  kuteshwar_right_status = "";

  // Kuteshwar Mine - Left Bank
  kuteshwar_left_lease_id = "";
  kuteshwar_left_lease_validity = "";
  kuteshwar_left_ec_validity = "";
  kuteshwar_left_install_cap = "";
  kuteshwar_left_status = "";

  // Nandini Mine
  nandini_lease_id = "";
  nandini_lease_validity = "";
  nandini_ec_validity = "";
  nandini_install_cap = "";
  nandini_status = "";

  // sourav code
  // ✅ Declare your chart options variable here
  filterbydateFlag = true;
  codRakeData: any[] = [];
  // linechartOptionsMineWise: Partial<ApexOptions>;
  // linechartOptionsDestinationWise: Partial<ApexOptions>;

  linechartOptionsMineWiseLUMP: Partial<ApexOptions>;
  linechartOptionsMineWiseFINES: Partial<ApexOptions>;

  linechartOptionsDestinationWiseLUMP: Partial<ApexOptions>;
  linechartOptionsDestinationWiseFINES: Partial<ApexOptions>;

  // FOR PRODUCTION
  totalLumpProdAllGroups: number = 0;
  totalFinesProdAllGroups: number = 0;

  // FOR DISPATCH
  totalLumpDispAllGroups: number = 0;
  totalFinesDispAllGroups: number = 0;

  //***For Statutory part***//
  statutorycriteria = { MINES_CLUSTER: "", MINES_DESC: 0 };
  mineGroupList: any[] = [];
  mineList: any[] = [];
  filteredMines: any[] = [];
  MineStatutoryDisplay: any = {}; // For simplified view
  // sourav code

  /**
   * Constructor
   */
  constructor(
    private _projectService: ProjectService,
    private _router: Router,
    private commonService: CommonService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private productionService: ProductionService,
    private dispatchService: DispatchService,
    private plantperformanceService: PlantperformanceService,
    private _changeDetectorRef: ChangeDetectorRef,
    private actualQualitiesService: ActualQualitiesService,
    private MinesService: MinesService,
    private _snackBar: MatSnackBar,
    private rakeplanService: RakeplanService,
    private licminemineralsService: LicminemineralsService //sourav code
  ) {
    // Subtract one day from the current date
    this.previousDay.setDate(this.previousDay.getDate() - 1);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.setEndDateRangeBasedOnStart(this.filtercriteria.start); //sourav code
    this.filterJson.date = this.previousDay;
    this.user = this.commonService.getItem("currentUser");
    this.statutoryTree();
    this.getMinesGroup();
    this.getMinesStatutory();

    this.countWidgets();
    this.groupWiseProduction();
    this.groupWiseDispatch();
    this.performanceWidgets();
    // this.qualityWidget(); //sourav code comment
    this.qualityWidgetMineWise(); //sourav coe
    this.qualityWidgetDestinationWise(); //sourav code
    this.rakeDetails();
    this.getMinesCluster();
    this.getMineGroupMineDropDown(); //sourav code

    console.log(`
  
     ███████╗ ██████╗ ███████╗████████╗███╗   ███╗███████╗███████╗████████╗███████╗
     ██╔════╝██╔═══██╗██╔════╝╚══██╔══╝████╗ ████║██╔════╝██╔════╝╚══██╔══╝██╔════╝
     ███████╗██║   ██║█████╗     ██║   ██╔████╔██║█████╗  █████╗     ██║   ███████╗
     ╚════██║██║   ██║██╔══╝     ██║   ██║╚██╔╝██║██╔══╝  ██╔══╝     ██║   ╚════██║
     ███████║╚██████╔╝██║        ██║   ██║ ╚═╝ ██║███████╗███████╗   ██║   ███████║
     ╚══════╝ ╚═════╝ ╚═╝        ╚═╝   ╚═╝     ╚═╝╚══════╝╚══════╝   ╚═╝   ╚══════╝
  
      PROUDLY DESIGNED DEVELOPED BY SOFTMEETS INFO SOLUTIONS PVT. LTD.
      
      Front-End Team - Arghya, Sannu, Proloy.
      Back-End Team - Argha Sir, Ranjan, Sayantan.
      With Heart & Soul Supported By Saurabh Sir And Ravishankar Sir (SAIL ISP).
  `);
  }

  //sourav code
  getYesterdayDate(): Date {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today;
  }

  onStartDateChange(): void {
    this.setEndDateRangeBasedOnStart(this.filtercriteria.start);

    if (this.validateDateRange()) {
      this.callAllDateDependentApis();
    }
  }

  onEndDateChange(): void {
    if (this.validateDateRange()) {
      this.callAllDateDependentApis();
    }
  }

  validateDateRange(): boolean {
    if (
      this.filtercriteria.start &&
      this.filtercriteria.end &&
      this.filtercriteria.end < this.filtercriteria.start
    ) {
      this.filtercriteria.end = null;
      setTimeout(() => {
        this.filtercriteria.end = this.filtercriteria.start;
      }, 0);

      this._snackBar.open("End date cannot be earlier than start date!", "", {
        duration: 3000,
        panelClass: ["error-snackbar"],
      });

      return false; // Validation failed
    }

    return true; // Validation passed
  }

  private setEndDateRangeBasedOnStart(startDate: Date): void {
    const selectedStart = new Date(startDate);
    this.minEndDate = new Date(
      selectedStart.getFullYear(),
      selectedStart.getMonth(),
      1
    );
    this.maxEndDate = new Date(
      selectedStart.getFullYear(),
      selectedStart.getMonth() + 1,
      0
    );

    // If end date is out of the allowed range, reset it to min
    if (
      this.filtercriteria.end < this.minEndDate ||
      this.filtercriteria.end > this.maxEndDate
    ) {
      this.filtercriteria.end = this.minEndDate;
    }
  }

  callAllDateDependentApis(): void {
    this.getMinesCluster();
    this.countWidgets();
    this.groupWiseProduction();
    this.groupWiseDispatch();
    this.performanceWidgets();
    this.qualityWidgetMineWise();
    this.qualityWidgetDestinationWise();
    this.rakeDetails();
  }

  //sourav code

  onTabChange(event: any) {
    if (event.tab.textLabel === "Home") {
      this.filterJson.date = this.previousDay; //sourav code
      this.filterbydateFlag = true; //sourav code
      this.runFunctionOnHomeTab();
    }
    // sourav code
    else {
      this.filterbydateFlag = false;
      this.previousDay = new Date(this.today); // Reset to today first
      this.previousDay.setDate(this.today.getDate() - 1);
    }
    // sourav code
  }

  runFunctionOnHomeTab() {
    // Your function logic here
    // console.log("Home tab selected");
    this.user = this.commonService.getItem("currentUser");
    this.statutoryTree();
    this.getMinesGroup();

    this.countWidgets();
    this.groupWiseProduction();
    this.groupWiseDispatch();
    this.performanceWidgets();
    // this.qualityWidget(); //sourav code comment
    this.qualityWidgetMineWise(); //sourav code
    this.qualityWidgetDestinationWise(); //sourav code
    this.rakeDetails();
    this.getMinesCluster();
    // this.renderChart();
  }

  getMinesCluster() {
    // sourav code
    // If filterJson.date is falsy (null/undefined), use current date or some default
    // const dateToSend = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]"); // or null or whatever default

    // const obj: any = { date: dateToSend };
    // sourav code

    this.MinesService.minescluster({}) //sourav code comment
      // this.MinesService.minescluster({ date: obj.date }) //sourav code
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          //   console.log(response)
          this.minecluster = JSON.parse(JSON.stringify(response));
          //   this.mines.MINES_CLUSTER = this.minecluster[0].CLUSTER_NAME;
        },
        error: (respError) => {
          this._snackBar.open(respError, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  countWidgets() {
    // sourav code
    // If filterJson.date is falsy (null/undefined), use current date or some default
    // const dateToSend = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]"); // or null or whatever default

    // const obj: any = { date: dateToSend };

    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      start: startDateToSend,
      end: endDateToSend,
    };

    // sourav code

    this.productionService
      // .countWidgets({ date: this.previousDay.toISOString() }) //sourav code comment
      .countWidgets(obj) //sourav code
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // console.log(response);
          this.countWidget = JSON.parse(JSON.stringify(response));
        },
        (respError) => {
          this.commonService.showSnakBarMessage(respError, "error", 2000);
        }
      );
  }

  groupWiseProduction() {
    // sourav code
    // If filterJson.date is falsy (null/undefined), use current date or some default
    // const dateToSend = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]"); // or null or whatever default

    // const obj: any = { date: dateToSend };

    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      start: startDateToSend,
      end: endDateToSend,
    };
    // sourav code

    this.productionService
      // .groupWiseProduction({ date: this.previousDay.toISOString() }) //sourav code comment
      .groupWiseProduction(obj) //sourav code
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // console.log(response);
          if (!Array.isArray(response) || response.length === 0) {
            console.warn("No data received for group-wise production");
            return;
          }

          this.groupwiseprodchartOptions = [];

          this.createPordChartTable(response);
        },
        (respError) => {
          this.commonService.showSnakBarMessage(respError, "error", 2000);
        }
      );
  }

  createPordChartTable(response) {
    response.forEach((item: any) => {
      const mines = item.mines || [];
      // console.log(mines);

      //sourav code comment
      // const totalLump = mines.reduce(
      //   (sum, mine) => sum + (mine.total_lump_prod || 0),
      //   0
      // );
      // const totalFines = mines.reduce(
      //   (sum, mine) => sum + (mine.total_fines_prod || 0),
      //   0
      // );
      //sourav code comment

      //sourav code
      const totalLump = mines.reduce(
        (sum, mine) => sum + Math.round(mine.total_lump_prod || 0),
        0
      );
      const totalFines = mines.reduce(
        (sum, mine) => sum + Math.round(mine.total_fines_prod || 0),
        0
      );
      //sourav code

      if (mines.length > 0) {
        let row = {
          head:
            item.cluster_name == "Jharkhand Group of Mines (JGOM)"
              ? "Jharkhand Group of Mines"
              : item.cluster_name == "Odisha Group of Mines (OGOM)"
              ? "Odisha Group of Mines"
              : item.cluster_name == "Chhattisgarh Group of Mines (CGOM)"
              ? "Chhattisgarh Group of Mines"
              : "Others Group of Mines (OGOM)",
          title: item.cluster_name,
          // totalLump: totalLump, //sourav code comment
          // totalFines: totalFines, //sourav code comment

          totalLump: Math.round(totalLump), //sourav code
          totalFines: Math.round(totalFines), //sourav code

          chartOptions: <Partial<ChartOptions>>{
            // series: [
            //   {
            //     name: "Lump Production",
            //     type: "column",
            //     data: mines.map((m) => m.total_lump_prod || 0),
            //   },
            //   {
            //     name: "Fines Production",
            //     type: "column",
            //     data: mines.map((m) => m.total_fines_prod || 0),
            //     dataLabels: {
            //       enabled: true,
            //       position: "center", // Position the label in the center of the bar
            //       style: {
            //         fontSize: "19px",
            //         fontWeight: "bold",
            //         colors: ["#000"], // You can adjust the color here as needed
            //       },
            //     },
            //   },
            //   // {
            //   //   name: "ABP Lump",
            //   //   data: mines.map((m) => m.total_plan_abp_lump || 0),
            //   //   type: "line",

            //   //   color: "#0068b6",
            //   // },
            //   // {
            //   //   name: "ABP Fines",
            //   //   data: mines.map((m) => m.total_plan_abp_fines || 0),
            //   //   type: "line",
            //   //   // dataLabels: {
            //   //   //   enabled: false, // No data labels for this series
            //   //   // },
            //   //   color: "#0a8e24",
            //   // },
            // ],
            series: [
              {
                name: "Lump Production",
                data: mines.map((mine) => ({
                  x: mine.mine_name, // mine_name
                  // y: mine.total_lump_prod, // total_lump_prod //sourav code comment
                  y: Math.round(mine.total_lump_prod || 0), //sourav code
                  goals: [
                    {
                      name: "ABP Lump",
                      // value: mine.total_plan_abp_lump, // total_plan_abp_lump //sourav code comment
                      value: Math.round(mine.total_plan_abp_lump || 0), //sourav code
                      strokeWidth: 20,
                      strokeColor: "#D32F2F",
                    },
                  ],
                })),
              },
              {
                name: "Fines Production",
                data: mines.map((mine) => ({
                  x: mine.mine_name, // mine_name
                  // y: mine.total_fines_prod, // total_lump_prod //sourav code comment
                  y: Math.round(mine.total_fines_prod || 0), //sourav code
                  goals: [
                    {
                      name: "ABP Fines",
                      // value: mine.total_plan_abp_fines, // total_plan_abp_lump //sourav code comment
                      value: Math.round(mine.total_plan_abp_fines || 0), //sourav code
                      strokeWidth: 20,
                      strokeColor: "#D32F2F",
                    },
                  ],
                })),
              },
            ],
            chart: {
              height: 350,
              type: "bar",
            },
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            colors: ["#00E396"],
            // chart: {
            //   type: "bar", // This is the default type of the chart, but it will adapt based on series type
            //   height: 350,
            //   toolbar: {
            //     show: true,
            //   },
            //   zoom: {
            //     enabled: false,
            //   },
            // },
            // plotOptions: {
            //   bar: {
            //     horizontal: false,
            //     dataLabels: {
            //       enabled: true, // Enable data labels on bars globally
            //       position: "center", // Positioning for bar charts
            //     },
            //     formatter: (val) => {
            //       if (typeof val === "number") {
            //         return val > 0 ? val : ""; // Show only if value > 0
            //       }
            //       return ""; // Return empty if val is not a number
            //     },
            //   },
            //   line: {
            //     // horizontal: false,
            //     dataLabels: {
            //       enabled: false, // No data labels for line charts globally
            //     },
            //     stroke: {
            //       width: [7],
            //       curve: "straight",
            //       dashArray: [8],
            //     },
            //   },
            // },
            dataLabels: {
              enabled: true, // Enable data labels globally (this works for bar charts primarily)
              style: {
                colors: ["#000"], // Text color for labels
              },
              // formatter: (val) => {
              //   if (typeof val === "number") {
              //     return val > 0 ? val : ""; // Show only if value > 0
              //   }
              //   return ""; // Return empty if val is not a number
              // },

              //sourav code
              formatter: (val) =>
                typeof val === "number" && val > 0
                  ? Math.round(val).toString()
                  : "",

              //sourav code
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            xaxis: {
              type: "category",
              categories: mines.map((m) => m.mine_name || "Unknown"),
            },
            //sourav code
            yaxis: {
              labels: {
                formatter: (val) => Math.round(val).toString(),
              },
              decimalsInFloat: 0,
            },
            //sourav code
            legend: {
              position: "bottom",
            },
            fill: {
              opacity: 1,
            },
          },
        };

        this.groupwiseprodchartOptions.push(row);

        // for lumps
        this.totalLumpProdAllGroups = this.groupwiseprodchartOptions.reduce(
          (sum, group) => sum + (group.totalLump || 0),
          0
        );

        // for fines
        this.totalFinesProdAllGroups = this.groupwiseprodchartOptions.reduce(
          (sum, group) => sum + (group.totalFines || 0),
          0
        );
      }
    });

    this._changeDetectorRef.markForCheck();
  }

  groupWiseDispatch() {
    // sourav code
    // If filterJson.date is falsy (null/undefined), use current date or some default
    // const dateToSend = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]"); // or null or whatever default

    // const obj: any = { date: dateToSend };

    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      start: startDateToSend,
      end: endDateToSend,
    };
    // sourav code

    this.dispatchService
      // .groupWiseDispatch({ date: this.previousDay.toISOString() }) //sourav code comment
      .groupWiseDispatch(obj) //sourav code

      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // console.log(response);
          if (!Array.isArray(response) || response.length === 0) {
            console.warn("No data received for group-wise production");
            return;
          }

          this.createDestChartTable(response);
        },
        (respError) => {
          this.commonService.showSnakBarMessage(respError, "error", 2000);
        }
      );
  }

  createDestChartTable(response) {
    this.groupwisedischartOptions = []; // Ensure array is reset before adding new data

    response.forEach((item) => {
      const mines = item.mines || [];

      //sourav code comment
      // const totalLumpDispatch = mines.reduce(
      //   (sum, m) => sum + (m.total_wgc_lump || 0),
      //   0
      // );
      // const totalFinesDispatch = mines.reduce(
      //   (sum, m) => sum + (m.total_wgc_fines || 0),
      //   0
      // );
      //sourav code comment

      //sourav code
      const totalLumpDispatch = mines.reduce(
        (sum, m) => sum + Math.round(m.total_wgc_lump || 0),
        0
      );
      const totalFinesDispatch = mines.reduce(
        (sum, m) => sum + Math.round(m.total_wgc_fines || 0),
        0
      );
      //sourav code

      if (mines.length > 0) {
        let row = {
          head:
            item.cluster_name == "Jharkhand Group of Mines (JGOM)"
              ? "Jharkhand Group of Mines"
              : item.cluster_name == "Odisha Group of Mines (OGOM)"
              ? "Odisha Group of Mines"
              : item.cluster_name == "Chhattisgarh Group of Mines (CGOM)"
              ? "Chhattisgarh Group of Mines"
              : "Others Group of Mines (OGOM)",

          title: item.cluster_name,
          // totalLumpDispatch: totalLumpDispatch, //sourav code comment
          // totalFinesDispatch: totalFinesDispatch, //sourav code comment
          totalLumpDispatch: Math.round(totalLumpDispatch), //sourav code
          totalFinesDispatch: Math.round(totalFinesDispatch), //sourav code

          chartOptions: <Partial<ChartOptions>>{
            series: [
              //sourav code comment
              // {
              //   name: "Total Lump Dispatch",
              //   data: mines.map((m) => Math.round(m.total_wgc_lump || 0)), //sourav code
              // },
              //sourav code comment

              //sourav code
              {
                name: "Total Lump Dispatch",
                data: mines.map((mine) => ({
                  x: mine.mine_name, // mine_name
                  y: Math.round(mine.total_wgc_lump || 0),
                  goals: [
                    {
                      name: "COD Lump",
                      value: Math.round(mine.target_cod_lump || 0),
                      strokeWidth: 20,
                      strokeColor: "#D32F2F",
                    },
                  ],
                })),
              },
              //sourav code
              //sourav code comment
              // {
              //   name: "Total Fines Dispatch",
              //   // data: mines.map((m) => m.total_wgc_fines || 0), //sourav code comment
              //   data: mines.map((m) => Math.round(m.total_wgc_fines || 0)), //sourav code
              // },
              //sourav code comment
              //sourav code
              {
                name: "Total Fines Dispatch",
                data: mines.map((mine) => ({
                  x: mine.mine_name, // mine_name
                  y: Math.round(mine.total_wgc_fines || 0),
                  goals: [
                    {
                      name: "COD Fines",
                      value: Math.round(mine.target_cod_fines || 0),
                      strokeWidth: 20,
                      strokeColor: "#D32F2F",
                    },
                  ],
                })),
              },
              //sourav code
            ],
            chart: {
              type: "bar",
              height: 350,
              stacked: false,
              toolbar: {
                show: true,
              },
              zoom: {
                enabled: true,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  total: {
                    enabled: true,
                    style: {
                      fontSize: "14px",
                      fontWeight: 600,
                    },
                  },
                },
              },
            },
            //sourav code
            dataLabels: {
              enabled: true,
              style: {
                colors: ["#000"],
              },
              formatter: (val) =>
                typeof val === "number" && val > 0
                  ? Math.round(val).toString()
                  : "",
            },
            //sourav code
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
            xaxis: {
              type: "category",
              categories: mines.map((m) => m.mine_name || "Unknown"),
            },
            yaxis: {
              labels: {
                formatter: (val) => Math.round(val).toString(),
              },
              decimalsInFloat: 0, //sourav code
            },

            legend: {
              position: "bottom",
            },
            fill: {
              opacity: 1,
            },
          },
        };

        this.groupwisedischartOptions.push(row);
        console.log(this.groupwisedischartOptions);

        // for lumps
        this.totalLumpDispAllGroups = this.groupwisedischartOptions.reduce(
          (sum, group) => sum + (group.totalLumpDispatch || 0),
          0
        );
        console.log(this.totalLumpDispAllGroups);

        // for fines
        this.totalFinesDispAllGroups = this.groupwisedischartOptions.reduce(
          (sum, group) => sum + (group.totalFinesDispatch || 0),
          0
        );
      }
    });

    this._changeDetectorRef.markForCheck();
  }

  performanceWidgets() {
    // sourav code
    // If filterJson.date is falsy (null/undefined), use current date or some default
    // const dateToSend = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]"); // or null or whatever default

    // const obj: any = { date: dateToSend };

    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      start: startDateToSend,
      end: endDateToSend,
    };
    // sourav code

    this.plantperformanceService
      // .performanceWidgets({ date: this.previousDay.toISOString() }) //sourav code comment
      .performanceWidgets(obj) //sourav code
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // console.log(response);
          if (!Array.isArray(response) || response.length === 0) {
            console.warn("No data received for group-wise production");
            return;
          }

          // Array 1: Production Data
          const productionData = response.map(
            ({
              plant_unit_id,
              plant_unit_name,
              total_hm_production,
              total_sinter_production,
              ABP_HM,
              ABP_SINTER,
            }) => ({
              plant_unit_id,
              plant_unit_name,
              total_hm_production,
              total_sinter_production,
              ABP_HM,
              ABP_SINTER,
            })
          );

          // Array 2: Stock Data
          const stockData = response.map(
            ({
              plant_unit_id,
              plant_unit_name,
              total_stock_lump,
              total_stock_fines,
              total_stock_pellet,
              total_stock_basemix,
            }) => ({
              plant_unit_id,
              plant_unit_name,
              total_stock_lump,
              total_stock_fines,
              total_stock_pellet,
              total_stock_basemix,
            })
          );

          this.createBarchart1(productionData);
          this.createBarchart2(stockData);
        },
        (respError) => {
          this.commonService.showSnakBarMessage(respError, "error", 2000);
        }
      );
  }

  createBarchart1(data: any[]) {
    //sourav code comment
    // const totalHotMetal = data.reduce(
    //   (sum, d) => sum + (d.total_hm_production ?? 0),
    //   0
    // );
    // const totalSinter = data.reduce(
    //   (sum, d) => sum + (d.total_sinter_production ?? 0),
    //   0
    // );
    //sourav code comment

    //sourav code
    const totalHotMetal = data.reduce(
      (sum, d) => sum + Math.round(d.total_hm_production ?? 0),
      0
    );
    const totalSinter = data.reduce(
      (sum, d) => sum + Math.round(d.total_sinter_production ?? 0),
      0
    );
    //sourav code

    //sourav code comment
    // this.totalHotMetal = totalHotMetal;
    // this.totalSinter = totalSinter;
    //sourav code comment

    //sourav code
    this.totalHotMetal = Math.round(totalHotMetal);
    this.totalSinter = Math.round(totalSinter);
    //sourav code

    this.performancebarchartOptions1 = <ApexOptions>{
      // series: [
      //   {
      //     name: "Hot Metal Production",
      //     data: data.map((d) => d.total_hm_production),
      //   },
      //   {
      //     name: "Sinter Production",
      //     data: data.map((d) => d.total_sinter_production),
      //   },
      // ],
      // chart: {
      //   type: "bar",
      //   height: 350,
      // },
      // plotOptions: {
      //   bar: {
      //     horizontal: false,
      //     columnWidth: "70%",
      //     borderRadius: 3,
      //   },
      // },
      series: [
        {
          name: "Hot Metal Production",
          data: data.map((mine) => ({
            x: mine.plant_unit_name, // mine_name
            // y: mine.total_hm_production, // total_lump_prod //sourav code comment
            y: Math.round(mine.total_hm_production || 0), //sourav code
            goals: [
              {
                name: "ABP Hot Metal",
                // value: mine.ABP_HM, // total_plan_abp_lump //sourav code comment
                value: Math.round(mine.ABP_HM || 0), //sourav code
                strokeWidth: 20,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
        {
          name: "Sinter Production",
          data: data.map((mine) => ({
            x: mine.plant_unit_name, // mine_name
            // y: mine.total_sinter_production, // total_lump_prod //sourav code comment
            y: Math.round(mine.total_sinter_production || 0), //sourav code
            goals: [
              {
                name: "ABP Sinter",
                // value: mine.ABP_SINTER, // total_plan_abp_lump //sourav code comment
                value: Math.round(mine.ABP_SINTER || 0), //sourav code
                strokeWidth: 20,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
      ],
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      colors: ["#CD5C5C", "#FFD700"], // 🔴 Red, 🟡 Yellow
      dataLabels: {
        enabled: true,
        formatter: (val) =>
          typeof val === "number" && val > 0 ? Math.round(val).toString() : "",
        style: {
          fontSize: "12px",
          colors: ["#000"], // Adjust color if needed
        },
      },
      xaxis: {
        categories: data.map((d) => d.plant_unit_name),
        labels: {
          rotate: -90, // Rotates X-axis labels
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => Math.round(val).toString(),
        },
        decimalsInFloat: 0,
      },
      fill: {
        opacity: 1,
        colors: ["#CD5C5C", "#FFD700"], // 🔴 Red, 🟡 Yellow
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        markers: {
          fillColors: ["#CD5C5C", "#FFD700"], // Light red and yellow
        },
      },
      tooltip: {
        y: {
          formatter: (val) => Math.round(val).toString(),
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
    };
  }

  createBarchart2(data: any[]) {
    this.performancebarchartOptions2 = <ApexOptions>{
      series: [
        {
          name: "Total Lump",
          data: data.map((d) => d.total_stock_lump),
        },
        {
          name: "Total Fines",
          data: data.map((d) => d.total_stock_fines), // Fixed the property name
        },
        {
          name: "Total Pellet",
          data: data.map((d) => d.total_stock_pellet),
        },
        {
          name: "Total Basemix",
          data: data.map((d) => d.total_stock_basemix),
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "85%",
          borderRadius: 3,
        },
      },
      dataLabels: {
        enabled: true,
        // formatter: (val) => (typeof val === "number" ? val.toFixed(2) : val), //sourav code comment
        formatter: (val) =>
          typeof val === "number" ? Math.round(val).toString() : val, //sourav code
        style: {
          fontSize: "12px",
          colors: ["#000"], // Adjust color if needed
        },
      },
      xaxis: {
        categories: data.map((d) => d.plant_unit_name),
      },
      //sourav code
      yaxis: {
        labels: {
          formatter: (val) => Math.round(val).toString(),
        },
        decimalsInFloat: 0, // ✅ Prevents long decimals
      },
      //sourav code

      fill: {
        opacity: 1,
      },
      tooltip: {
        //sourav code comment
        // y: {
        //   formatter: (val) => val.toFixed(2),
        // },
        //sourav code comment
        //sourav code
        y: {
          formatter: (val) => Math.round(val).toString(), // ✅ Removes decimals in tooltip
        },
        //sourav code
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
    };
  }

  // sourav code comment
  // qualityWidget() {
  //   this.actualQualitiesService
  //     .qualityWidget({ date: this.previousDay.toISOString() })
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe(
  //       (response: any) => {
  //         // console.log(response);
  //         // if (!Array.isArray(response) || response.length === 0) {
  //         //     console.warn("No data received for group-wise production");
  //         //     return;
  //         // }

  //         response.Actual.sort((a, b) => a.MINE_ID - b.MINE_ID);
  //         response.Norm.sort((a, b) => a.MINE_ID - b.MINE_ID);
  //         this.createLinechart1(response);
  //         // this.groupWiseProd = response;
  //         // this.groupwisechartOptions = [];
  //       },
  //       (respError) => {
  //         this.commonService.showSnakBarMessage(respError, "error", 2000);
  //       }
  //     );
  // }
  //sourav code comment

  // sourav code
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    console.log("Selected date:", selectedDate);
    this.previousDay = selectedDate;
    console.log(this.previousDay);

    // Update filterJson.date with the new selected date
    this.filterJson.date = selectedDate;

    // Call the API with the new date
    this.getMinesCluster();

    this.countWidgets();

    this.groupWiseProduction();

    this.groupWiseDispatch();

    this.performanceWidgets();

    this.qualityWidgetMineWise();

    this.qualityWidgetDestinationWise();

    this.rakeDetails();
  }

  qualityWidgetMineWise() {
    // If filterJson.date is falsy (null/undefined), use current date or some default
    // const dateToSend = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]"); // or null or whatever default

    // const obj: any = { date: dateToSend };

    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      start: startDateToSend,
      end: endDateToSend,
    };

    this.actualQualitiesService
      .qualityWidgetMines(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          response.Norm.LUMP.sort((a, b) => a.MINE_ID - b.MINE_ID);
          response.Actual.LUMP.sort((a, b) => a.MINE_ID - b.MINE_ID);
          response.Norm.FINES.sort((a, b) => a.MINE_ID - b.MINE_ID);
          response.Actual.FINES.sort((a, b) => a.MINE_ID - b.MINE_ID);

          this.createBarChartsMineWise(response);
        },
        error: (respError) => {
          this.commonService.showSnakBarMessage(respError, "error", 2000);
        },
      });
  }

  // createLinechartMineWise(data) {
  //   // 1️⃣ Get unique Mines list for x-axis
  //   const categories = Array.from(
  //     new Set([
  //       ...data.Norm.LUMP.map((d) => d.MINES),
  //       ...data.Norm.FINES.map((d) => d.MINES),
  //     ])
  //   );

  //   // 2️⃣ Helper to get value or null if mine not in data array
  //   const getValue = (arr, mine, prop) =>
  //     arr.find((item) => item.MINES === mine)?.[prop] ?? null;

  //   // 3️⃣ Create series data aligned to categories
  //   this.linechartOptionsMineWise = <ApexOptions>{
  //     series: [
  //       {
  //         name: "Fe Norm LUMP",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Norm.LUMP, mine, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Norm LUMP",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Norm.LUMP, mine, "avg_GUAGE")) || null
  //         ),
  //       },
  //       {
  //         name: "Fe Actual LUMP",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Actual.LUMP, mine, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Actual LUMP",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Actual.LUMP, mine, "avg_GUAGE")) || null
  //         ),
  //       },
  //       {
  //         name: "Fe Norm FINES",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Norm.FINES, mine, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Norm FINES",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Norm.FINES, mine, "avg_GUAGE")) || null
  //         ),
  //       },
  //       {
  //         name: "Fe Actual FINES",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Actual.FINES, mine, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Actual FINES",
  //         data: categories.map(
  //           (mine) =>
  //             parseFloat(getValue(data.Actual.FINES, mine, "avg_GUAGE")) || null
  //         ),
  //       },
  //     ],

  //     chart: {
  //       zoom: { enabled: false },
  //       height: 400,
  //       type: "line",
  //       dropShadow: {
  //         enabled: true,
  //         color: "#000",
  //         top: 18,
  //         left: 7,
  //         blur: 10,
  //         opacity: 0.2,
  //       },
  //       toolbar: { show: false },
  //     },

  //     colors: [
  //       "#0074D9",
  //       "#FF4136",
  //       "#2ECC40",
  //       "#FF851B",
  //       "#B10DC9",
  //       "#FFDC00",
  //       "#7FDBFF",
  //       "#85144b",
  //     ],

  //     dataLabels: { enabled: true },
  //     stroke: { curve: "smooth" },

  //     title: {
  //       text: "Fe & Gangue Comparison Mine Wise (LUMP & FINES)",
  //       align: "left",
  //     },

  //     grid: {
  //       borderColor: "#e7e7e7",
  //       row: { colors: ["#f3f3f3", "#ffffff"], opacity: 0.5 },
  //       padding: { bottom: 30 },
  //     },

  //     markers: { size: 4 },

  //     xaxis: {
  //       categories: categories,
  //       title: {
  //         text: "Mines",
  //         offsetY: 10,
  //       },
  //     },

  //     yaxis: {
  //       title: { text: "Values" },
  //       min:
  //         Math.min(
  //           ...data.Norm.LUMP.map((d) => +d.avg_FE),
  //           ...data.Norm.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_FE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Norm.FINES.map((d) => +d.avg_FE),
  //           ...data.Norm.FINES.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.FINES.map((d) => +d.avg_FE),
  //           ...data.Actual.FINES.map((d) => +d.avg_GUAGE)
  //         ) - 5,
  //       max:
  //         Math.max(
  //           ...data.Norm.LUMP.map((d) => +d.avg_FE),
  //           ...data.Norm.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_FE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Norm.FINES.map((d) => +d.avg_FE),
  //           ...data.Norm.FINES.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.FINES.map((d) => +d.avg_FE),
  //           ...data.Actual.FINES.map((d) => +d.avg_GUAGE)
  //         ) + 5,
  //     },

  //     legend: {
  //       position: "top",
  //       horizontalAlign: "center",
  //       floating: false,
  //       offsetY: 0,
  //     },
  //   };
  // }

  createBarChartsMineWise(data) {
    // Categories for LUMP & FINES separately
    const lumpCategories = Array.from(
      new Set([
        ...data.Norm.LUMP.map((d) => d.MINES),
        ...data.Actual.LUMP.map((d) => d.MINES),
      ])
    );

    const finesCategories = Array.from(
      new Set([
        ...data.Norm.FINES.map((d) => d.MINES),
        ...data.Actual.FINES.map((d) => d.MINES),
      ])
    );

    const getValue = (arr, mine, prop) =>
      arr.find((item) => item.MINES === mine)?.[prop] ?? null;

    // LUMP Chart
    this.linechartOptionsMineWiseLUMP = <ApexOptions>{
      series: [
        {
          name: "Fe Actual LUMP",
          data: lumpCategories.map((mine) => ({
            x: mine,
            y: parseFloat(getValue(data.Actual.LUMP, mine, "avg_FE")) || 0,
            goals: [
              {
                name: "Fe Norm LUMP",
                value:
                  parseFloat(getValue(data.Norm.LUMP, mine, "avg_FE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
        {
          name: "Gangue Actual LUMP",
          data: lumpCategories.map((mine) => ({
            x: mine,
            y: parseFloat(getValue(data.Actual.LUMP, mine, "avg_GUAGE")) || 0,
            goals: [
              {
                name: "Gangue Norm LUMP",
                value:
                  parseFloat(getValue(data.Norm.LUMP, mine, "avg_GUAGE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
      ],
      chart: {
        type: "bar",
        height: 400,
        stacked: false,
      },
      colors: ["#429ff0", "#03569e"],
      title: {
        text: "Fe & Gangue Mine Wise (LUMP) ( in % )",
        align: "center",
      },
      xaxis: {
        categories: lumpCategories,
        title: { text: "Mines" },
      },
      yaxis: {
        title: { text: "Values ( in % )" },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#ffffff"],
        },
      },
      stroke: { show: true, width: 1 },
      grid: { borderColor: "#e7e7e7" },
      legend: {
        show: false,
        position: "top",
        horizontalAlign: "center",
      },
    };

    // FINES Chart
    this.linechartOptionsMineWiseFINES = <ApexOptions>{
      series: [
        {
          name: "Fe Actual FINES",
          data: finesCategories.map((mine) => ({
            x: mine,
            y: parseFloat(getValue(data.Actual.FINES, mine, "avg_FE")) || 0,
            goals: [
              {
                name: "Fe Norm FINES",
                value:
                  parseFloat(getValue(data.Norm.FINES, mine, "avg_FE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
        {
          name: "Gangue Actual FINES",
          data: finesCategories.map((mine) => ({
            x: mine,
            y: parseFloat(getValue(data.Actual.FINES, mine, "avg_GUAGE")) || 0,
            goals: [
              {
                name: "Gangue Norm FINES",
                value:
                  parseFloat(getValue(data.Norm.FINES, mine, "avg_GUAGE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
      ],
      chart: {
        type: "bar",
        height: 400,
        stacked: false,
      },
      colors: ["#17dd9b", "#046846"],
      title: {
        text: "Fe & Gangue Mine Wise (FINES) ( in % )",
        align: "center",
      },
      xaxis: {
        categories: finesCategories,
        title: { text: "Mines" },
      },
      yaxis: {
        title: { text: "Values ( in % )" },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#000000"],
        },
      },
      stroke: { show: true, width: 1 },
      grid: { borderColor: "#e7e7e7" },
      legend: {
        show: false,
        position: "top",
        horizontalAlign: "center",
      },
    };
  }

  qualityWidgetDestinationWise() {
    // If filterJson.date is falsy (null/undefined), use current date or some default
    // const dateToSend = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]"); // or null or whatever default

    // const obj: any = { date: dateToSend };

    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      start: startDateToSend,
      end: endDateToSend,
    };

    this.actualQualitiesService
      .qualityWidgetDestination(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          // Sort the arrays for consistent ordering
          response.Norm.LUMP.sort(
            (a, b) => a.DESTINATION_ID - b.DESTINATION_ID
          );
          response.Actual.LUMP.sort(
            (a, b) => a.DESTINATION_ID - b.DESTINATION_ID
          );
          response.Norm.FINES.sort(
            (a, b) => a.DESTINATION_ID - b.DESTINATION_ID
          );
          response.Actual.FINES.sort(
            (a, b) => a.DESTINATION_ID - b.DESTINATION_ID
          );

          this.createBarChartsDestinationWise(response);
        },
        error: (respError) => {
          this.commonService.showSnakBarMessage(respError, "error", 2000);
        },
      });
  }

  // createLinechartDestinationWise(data) {
  //   // 1️⃣ Get unique Destination list for x-axis categories
  //   const categories = Array.from(
  //     new Set([
  //       ...data.Norm.LUMP.map((d) => d.DESTINATION),
  //       ...data.Norm.FINES.map((d) => d.DESTINATION),
  //       ...data.Actual.LUMP.map((d) => d.DESTINATION),
  //       ...data.Actual.FINES.map((d) => d.DESTINATION),
  //     ])
  //   );

  //   // 2️⃣ Helper to get value or null if not present for a destination
  //   const getValue = (arr, destination, prop) =>
  //     arr.find((item) => item.DESTINATION === destination)?.[prop] ?? null;

  //   // 3️⃣ Build series data aligned to categories
  //   this.linechartOptionsDestinationWise = <ApexOptions>{
  //     series: [
  //       {
  //         name: "Fe Norm LUMP",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Norm.LUMP, dest, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Norm LUMP",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Norm.LUMP, dest, "avg_GUAGE")) || null
  //         ),
  //       },
  //       {
  //         name: "Fe Actual LUMP",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Actual.LUMP, dest, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Actual LUMP",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Actual.LUMP, dest, "avg_GUAGE")) || null
  //         ),
  //       },
  //       {
  //         name: "Fe Norm FINES",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Norm.FINES, dest, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Norm FINES",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Norm.FINES, dest, "avg_GUAGE")) || null
  //         ),
  //       },
  //       {
  //         name: "Fe Actual FINES",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Actual.FINES, dest, "avg_FE")) || null
  //         ),
  //       },
  //       {
  //         name: "Gangue Actual FINES",
  //         data: categories.map(
  //           (dest) =>
  //             parseFloat(getValue(data.Actual.FINES, dest, "avg_GUAGE")) || null
  //         ),
  //       },
  //     ],

  //     chart: {
  //       zoom: { enabled: false },
  //       height: 400,
  //       type: "line",
  //       dropShadow: {
  //         enabled: true,
  //         color: "#000",
  //         top: 18,
  //         left: 7,
  //         blur: 10,
  //         opacity: 0.2,
  //       },
  //       toolbar: { show: false },
  //     },

  //     colors: [
  //       "#0074D9",
  //       "#FF4136",
  //       "#2ECC40",
  //       "#FF851B",
  //       "#B10DC9",
  //       "#FFDC00",
  //       "#7FDBFF",
  //       "#85144b",
  //     ],

  //     dataLabels: { enabled: true },
  //     stroke: { curve: "smooth" },

  //     title: {
  //       text: "Fe & Gangue Comparison Destination Wise (LUMP & FINES)",
  //       align: "left",
  //     },

  //     grid: {
  //       borderColor: "#e7e7e7",
  //       row: { colors: ["#f3f3f3", "#ffffff"], opacity: 0.5 },
  //       padding: { bottom: 30 },
  //     },

  //     markers: { size: 4 },

  //     xaxis: {
  //       categories: categories,
  //       title: {
  //         text: "Destinations",
  //         offsetY: 10,
  //       },
  //     },

  //     yaxis: {
  //       title: { text: "Values" },
  //       min:
  //         Math.min(
  //           ...data.Norm.LUMP.map((d) => +d.avg_FE),
  //           ...data.Norm.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_FE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Norm.FINES.map((d) => +d.avg_FE),
  //           ...data.Norm.FINES.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.FINES.map((d) => +d.avg_FE),
  //           ...data.Actual.FINES.map((d) => +d.avg_GUAGE)
  //         ) - 5,
  //       max:
  //         Math.max(
  //           ...data.Norm.LUMP.map((d) => +d.avg_FE),
  //           ...data.Norm.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_FE),
  //           ...data.Actual.LUMP.map((d) => +d.avg_GUAGE),
  //           ...data.Norm.FINES.map((d) => +d.avg_FE),
  //           ...data.Norm.FINES.map((d) => +d.avg_GUAGE),
  //           ...data.Actual.FINES.map((d) => +d.avg_FE),
  //           ...data.Actual.FINES.map((d) => +d.avg_GUAGE)
  //         ) + 5,
  //     },

  //     legend: {
  //       position: "top",
  //       horizontalAlign: "center",
  //       floating: false,
  //       offsetY: 0,
  //     },
  //   };
  // }

  // sourav code

  createBarChartsDestinationWise(data) {
    // Separate DESTINATION categories for LUMP & FINES
    const lumpCategories = Array.from(
      new Set([
        ...data.Norm.LUMP.map((d) => d.DESTINATION),
        ...data.Actual.LUMP.map((d) => d.DESTINATION),
      ])
    );

    const finesCategories = Array.from(
      new Set([
        ...data.Norm.FINES.map((d) => d.DESTINATION),
        ...data.Actual.FINES.map((d) => d.DESTINATION),
      ])
    );

    const getValue = (arr, dest, prop) =>
      arr.find((item) => item.DESTINATION === dest)?.[prop] ?? null;

    // LUMP Chart
    this.linechartOptionsDestinationWiseLUMP = <ApexOptions>{
      series: [
        {
          name: "Fe Actual LUMP",
          data: lumpCategories.map((dest) => ({
            x: dest,
            y: parseFloat(getValue(data.Actual.LUMP, dest, "avg_FE")) || 0,
            goals: [
              {
                name: "Fe Norm LUMP",
                value:
                  parseFloat(getValue(data.Norm.LUMP, dest, "avg_FE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
        {
          name: "Gangue Actual LUMP",
          data: lumpCategories.map((dest) => ({
            x: dest,
            y: parseFloat(getValue(data.Actual.LUMP, dest, "avg_GUAGE")) || 0,
            goals: [
              {
                name: "Gangue Norm LUMP",
                value:
                  parseFloat(getValue(data.Norm.LUMP, dest, "avg_GUAGE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
      ],
      chart: {
        type: "bar",
        height: 400,
        stacked: false,
      },
      colors: ["#429ff0", "#03569e"],
      title: {
        text: "Fe & Gangue Destination Wise (LUMP) ( in % )",
        align: "center",
      },
      xaxis: {
        categories: lumpCategories,
        title: { text: "Destinations" },
      },
      yaxis: {
        title: { text: "Values ( in % )" },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#ffffff"],
        },
      },
      stroke: { show: true, width: 1 },
      grid: { borderColor: "#e7e7e7" },
      legend: {
        show: false,
        position: "top",
        horizontalAlign: "center",
      },
    };

    // FINES Chart
    this.linechartOptionsDestinationWiseFINES = <ApexOptions>{
      series: [
        {
          name: "Fe Actual FINES",
          data: finesCategories.map((dest) => ({
            x: dest,
            y: parseFloat(getValue(data.Actual.FINES, dest, "avg_FE")) || 0,
            goals: [
              {
                name: "Fe Norm FINES",
                value:
                  parseFloat(getValue(data.Norm.FINES, dest, "avg_FE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
        {
          name: "Gangue Actual FINES",
          data: finesCategories.map((dest) => ({
            x: dest,
            y: parseFloat(getValue(data.Actual.FINES, dest, "avg_GUAGE")) || 0,
            goals: [
              {
                name: "Gangue Norm FINES",
                value:
                  parseFloat(getValue(data.Norm.FINES, dest, "avg_GUAGE")) || 0,
                strokeWidth: 8,
                strokeColor: "#D32F2F",
              },
            ],
          })),
        },
      ],
      chart: {
        type: "bar",
        height: 400,
        stacked: false,
      },
      colors: ["#17dd9b", "#046846"],
      title: {
        text: "Fe & Gangue Destination Wise (FINES) ( in % )",
        align: "center",
      },
      xaxis: {
        categories: finesCategories,
        title: { text: "Destinations" },
      },
      yaxis: {
        title: { text: "Values ( in % )" },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#ffffff"],
        },
      },
      stroke: { show: true, width: 1 },
      grid: { borderColor: "#e7e7e7" },
      legend: {
        show: false,
        position: "top",
        horizontalAlign: "center",
      },
    };
  }

  rakeDetails() {
    // sourav code
    // const dateToSend: string = this.filterJson.date
    //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
    //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    // const requestPayload = { date: dateToSend };

    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      start: startDateToSend,
      end: endDateToSend,
    };
    // sourav code
    this.rakeplanService
      // .rakeDetails({}) //sourav code comment
      .rakeDetails(obj) //sourav code
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // this.createLinechart2(response); //sourav code comment
          //sourav code
          this.codRakeData = Array.isArray(response) ? response : [response]; // Ensure codRakeData is always an array
          this.getDispatchRake(); // Then call dispatch rake
          //sourav code
          // this.createBarChart2(response); //sourav code
          // this.groupWiseProd = response;
          // this.groupwisechartOptions = [];
        },
        (respError) => {
          this.commonService.showSnakBarMessage(respError, "error", 2000);
        }
      );
  }

  // createLinechart1(data) {
  //   this.linechartOptions1 = <ApexOptions>{
  //     series: [
  //       {
  //         name: "Fe Norm",
  //         data: data.Norm.map((d) => d.avg_FE),
  //       },
  //       {
  //         name: "Gangue Norm",
  //         data: data.Norm.map((d) => d.avg_GUAGE),
  //       },
  //       {
  //         name: "Fe Actual",
  //         data: data.Actual.map((d) => d.avg_FE),
  //       },
  //       {
  //         name: "Gangue Actual",
  //         data: data.Actual.map((d) => d.avg_GUAGE),
  //       },
  //     ],
  //     chart: {
  //       zoom: {
  //         enabled: false,
  //       },
  //       height: 350,
  //       type: "line",
  //       dropShadow: {
  //         enabled: true,
  //         color: "#000",
  //         top: 18,
  //         left: 7,
  //         blur: 10,
  //         opacity: 0.2,
  //       },
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     colors: ["#77B6EA", "#545454", "#FFA500", "#FF0000"], // Added distinct colors for all series
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     stroke: {
  //       curve: "smooth",
  //     },
  //     title: {
  //       text: "Fe & Gangue Comparison",
  //       align: "left",
  //     },
  //     grid: {
  //       borderColor: "#e7e7e7",
  //       row: {
  //         colors: ["#f3f3f3", "#ffffff"], // Better background alternation
  //         opacity: 0.5,
  //       },
  //     },
  //     markers: {
  //       size: 4,
  //     },
  //     xaxis: {
  //       categories: data.Norm.map((d) => d.MINES),
  //       title: {
  //         text: "Mines",
  //       },
  //     },
  //     yaxis: {
  //       title: {
  //         text: "Values",
  //       },
  //       min:
  //         Math.min(
  //           ...data.Norm.map((d) => d.avg_FE),
  //           ...data.Norm.map((d) => d.avg_GUAGE),
  //           ...data.Actual.map((d) => d.avg_FE),
  //           ...data.Actual.map((d) => d.avg_GUAGE)
  //         ) - 5, // Dynamic min
  //       max:
  //         Math.max(
  //           ...data.Norm.map((d) => d.avg_FE),
  //           ...data.Norm.map((d) => d.avg_GUAGE),
  //           ...data.Actual.map((d) => d.avg_FE),
  //           ...data.Actual.map((d) => d.avg_GUAGE)
  //         ) + 5, // Dynamic max
  //     },
  //     legend: {
  //       position: "bottom",
  //       horizontalAlign: "right",
  //       floating: true,
  //     },
  //   };
  // }

  // sourav code comment
  // createLinechart2(data) {
  //   this.linechartOptions2 = <ApexOptions>{
  //     series: [
  //       {
  //         name: "COD Rake",
  //         data: data.map((d) => d.RAKE_PER_MONTH_AVG),
  //       },
  //       {
  //         name: "Dispatch Rake",
  //         data: data.map((d) => d.AGGREGATE_AVG),
  //       },
  //     ],
  //     chart: {
  //       zoom: {
  //         enabled: false,
  //       },
  //       height: 350,
  //       type: "line",
  //       dropShadow: {
  //         enabled: true,
  //         color: "#000",
  //         top: 18,
  //         left: 7,
  //         blur: 10,
  //         opacity: 0.2,
  //       },
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     colors: ["#77B6EA", "#545454"], // Added distinct colors for all series
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     stroke: {
  //       curve: "smooth",
  //     },
  //     title: {
  //       // text: "FE & Gangue Comparison",
  //       align: "left",
  //     },
  //     grid: {
  //       borderColor: "#e7e7e7",
  //       row: {
  //         colors: ["#f3f3f3", "#ffffff"], // Better background alternation
  //         opacity: 0.5,
  //       },
  //     },
  //     markers: {
  //       size: 4,
  //     },
  //     xaxis: {
  //       categories: data.map((d) => d.RAKE_CD),
  //       // title: {
  //       //     text: "Mines",
  //       // },
  //     },
  //     yaxis: {
  //       // title: {
  //       //     text: "Values",
  //       // },
  //       // min:
  //       //     Math.min(
  //       //         ...data.Norm.map((d) => d.avg_FE),
  //       //         ...data.Norm.map((d) => d.avg_GUAGE),
  //       //         ...data.Actual.map((d) => d.avg_FE),
  //       //         ...data.Actual.map((d) => d.avg_GUAGE)
  //       //     ) - 5, // Dynamic min
  //       // max:
  //       //     Math.max(
  //       //         ...data.Norm.map((d) => d.avg_FE),
  //       //         ...data.Norm.map((d) => d.avg_GUAGE),
  //       //         ...data.Actual.map((d) => d.avg_FE),
  //       //         ...data.Actual.map((d) => d.avg_GUAGE)
  //       //     ) + 5, // Dynamic max
  //     },
  //     legend: {
  //       position: "bottom",
  //       horizontalAlign: "right",
  //       floating: true,
  //     },
  //   };
  // }
  // sourav code comment

  // sourav code comment
  // getDispatchRake(): void {
  //   // const dateToSend: string = this.filterJson.date
  //   //   ? moment(this.filterJson.date).format("YYYY-MM-DDT00:00:00.000[Z]")
  //   //   : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

  //   // const requestPayload = { DATE: dateToSend };

  //   //sourav code
  //   const startDateToSend = this.filtercriteria.start
  //     ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
  //     : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

  //   const endDateToSend = this.filtercriteria.end
  //     ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
  //     : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

  //   const obj: any = {
  //     DATE: startDateToSend,
  //     ENDDATE: endDateToSend,
  //   };

  //   // sourav code
  //   this.rakeplanService
  //     .rakeDistirbutionReport(obj)
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe({
  //       next: (response: any) => {
  //         const avgValues = response.aggregate.avg;

  //         // 📌 categories based on codRakeData to preserve all RAKE_CD entries
  //         const categories = this.codRakeData.map((item) => item.RAKE_CD);

  //         const chartData = categories.map((key) => {
  //           const codData = this.codRakeData.find(
  //             (item) => item.RAKE_CD === key
  //           );
  //           return {
  //             RAKE_CD: key,
  //             RAKE_PER_MONTH_AVG: codData ? codData.RAKE_PER_MONTH_AVG : 0,
  //             AGGREGATE_AVG: avgValues[key] || 0, // fallback to 0 if no dispatch data
  //           };
  //         });

  //         console.log("Final Merged Chart Data: ", chartData);
  //         this.createBarChart2(chartData);
  //       },
  //       error: (error) => {
  //         this.commonService.showSnakBarMessage(error, "error", 2000);
  //       },
  //     });
  // }
  // sourav code comment

  // sourav code
  getDispatchRake(): void {
    const startDateToSend = this.filtercriteria.start
      ? moment(this.filtercriteria.start).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const endDateToSend = this.filtercriteria.end
      ? moment(this.filtercriteria.end).format("YYYY-MM-DDT00:00:00.000[Z]")
      : moment().format("YYYY-MM-DDT00:00:00.000[Z]");

    const obj: any = {
      DATE: startDateToSend,
      ENDDATE: endDateToSend,
    };

    this.rakeplanService
      .rakeDistirbutionReport(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response: any) => {
          const avgValues = response.aggregate.avg;
          const avgOnDateRange = response.aggregate.avg_ondaterange;

          const categories = this.codRakeData.map((item) => item.RAKE_CD);

          const chartData = categories.map((key) => {
            const codData = this.codRakeData.find(
              (item) => item.RAKE_CD === key
            );
            return {
              RAKE_CD: key,
              RAKE_PER_MONTH_AVG: codData ? codData.RAKE_PER_MONTH_AVG : 0,
              AGGREGATE_AVG: avgValues[key] || 0,
              AVG_ON_DATE_RANGE: avgOnDateRange[key] || 0,
            };
          });

          // console.log("Final Merged Chart Data: ", chartData);
          this.createBarChart2(chartData);
        },
        error: (error) => {
          this.commonService.showSnakBarMessage(error, "error", 2000);
        },
      });
  }

  //sourav code

  // createBarChart2(data) {
  //   console.log(data);

  //   if (!data || !Array.isArray(data) || data.length === 0) {
  //     // Handle empty or invalid data gracefully, maybe clear chart or show message
  //     this.linechartOptions2 = null;
  //     return;
  //   }

  //   this.linechartOptions2 = <ApexOptions>{
  //     series: [
  //       {
  //         name: "COD Rake Plan",
  //         data: data.map((d) => d.RAKE_PER_MONTH_AVG ?? 0), // fallback to 0 if undefined
  //       },
  //       {
  //         name: "Dispatch Rake Actual",
  //         data: data.map((d) => d.AGGREGATE_AVG ?? 0), // fallback to 0 if undefined
  //       },
  //     ],
  //     chart: {
  //       type: "bar",
  //       height: 350,
  //       stacked: false,
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     colors: ["#1E90FF", "#FF7F50"], // Clean colors for bars
  //     dataLabels: {
  //       enabled: true,
  //       formatter: (val) => (typeof val === "number" ? val.toFixed(2) : val), // force 2 decimals for numbers only
  //       style: {
  //         colors: ["#000000"], // black color for data labels
  //       },
  //     },

  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         columnWidth: "50%",
  //         endingShape: "rounded",
  //       },
  //     },
  //     stroke: {
  //       show: true,
  //       width: 1,
  //       colors: ["#fff"],
  //     },
  //     grid: {
  //       borderColor: "#e7e7e7",
  //       row: {
  //         colors: ["#f3f3f3", "#ffffff"],
  //         opacity: 0.5,
  //       },
  //     },
  //     xaxis: {
  //       categories: data.map((d) => d.RAKE_CD ?? ""), // fallback to empty string if undefined
  //     },
  //     yaxis: {
  //       // title: {
  //       //   text: "Average",
  //       // },
  //       labels: {
  //         formatter: (val) => val.toFixed(2),
  //       },
  //     },
  //     legend: {
  //       position: "top",
  //       horizontalAlign: "center",
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: (val) => val.toFixed(2),
  //       },
  //     },
  //   };
  // }

  // sourav code comment

  // createBarChart2(data) {
  //   console.log(data);

  //   if (!data || !Array.isArray(data) || data.length === 0) {
  //     this.linechartOptions2 = null;
  //     return;
  //   }

  //   // Filter out entries where both values are 0 or falsy
  //   const filteredData = data.filter(
  //     (d) => (d.RAKE_PER_MONTH_AVG ?? 0) !== 0 || (d.AGGREGATE_AVG ?? 0) !== 0
  //   );

  //   // Calculate totals
  //   this.totalRakePlan = filteredData.reduce(
  //     (sum, d) => sum + (d.RAKE_PER_MONTH_AVG ?? 0),
  //     0
  //   );
  //   this.totalDispatchActual = filteredData.reduce(
  //     (sum, d) => sum + (d.AGGREGATE_AVG ?? 0),
  //     0
  //   );

  //   if (filteredData.length === 0) {
  //     this.linechartOptions2 = null;
  //     return;
  //   }

  //   this.linechartOptions2 = <ApexOptions>{
  //     series: [
  //       {
  //         name: "COD Rake Plan",
  //         data: filteredData.map((d) => d.RAKE_PER_MONTH_AVG ?? 0),
  //       },
  //       {
  //         name: "Dispatch Rake Actual",
  //         data: filteredData.map((d) => d.AGGREGATE_AVG ?? 0),
  //       },
  //     ],
  //     chart: {
  //       type: "bar",
  //       height: 350,
  //       stacked: false,
  //       toolbar: {
  //         show: false,
  //       },
  //     },
  //     colors: ["#773a02", "#FF7F50"],
  //     dataLabels: {
  //       enabled: true,
  //       formatter: (val) => (typeof val === "number" ? val.toFixed(2) : val),
  //       style: {
  //         colors: ["#000000"],
  //       },
  //     },
  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         columnWidth: "50%",
  //         endingShape: "rounded",
  //       },
  //     },
  //     stroke: {
  //       show: true,
  //       width: 1,
  //       colors: ["#fff"],
  //     },
  //     grid: {
  //       borderColor: "#e7e7e7",
  //       row: {
  //         colors: ["#f3f3f3", "#ffffff"],
  //         opacity: 0.5,
  //       },
  //     },
  //     xaxis: {
  //       categories: filteredData.map((d) => d.RAKE_CD ?? ""),
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val) => val.toFixed(2),
  //       },
  //     },
  //     legend: {
  //       itemMargin: { vertical: 25 },
  //       position: "bottom",
  //       horizontalAlign: "center",
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: (val) => val.toFixed(2),
  //       },
  //     },
  //   };
  // }

  createBarChart2(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      this.linechartOptions2 = null;
      return;
    }

    const filteredData = data.filter(
      (d) =>
        (d.RAKE_PER_MONTH_AVG ?? 0) !== 0 ||
        (d.AGGREGATE_AVG ?? 0) !== 0 ||
        (d.AVG_ON_DATE_RANGE ?? 0) !== 0
    );

    this.totalRakePlan = filteredData.reduce(
      (sum, d) => sum + (d.RAKE_PER_MONTH_AVG ?? 0),
      0
    );
    this.totalDispatchActual = filteredData.reduce(
      (sum, d) => sum + (d.AGGREGATE_AVG ?? 0),
      0
    );

    this.totalDispatchAvg = filteredData.reduce(
      (sum, d) => sum + (d.AVG_ON_DATE_RANGE ?? 0),
      0
    );

    if (filteredData.length === 0) {
      this.linechartOptions2 = null;
      return;
    }

    this.linechartOptions2 = <ApexOptions>{
      series: [
        {
          name: "COD Rake Plan",
          data: filteredData.map((d) => d.RAKE_PER_MONTH_AVG ?? 0),
        },
        {
          name: "Despatch rake (Actual Till Date)",
          data: filteredData.map((d) => d.AGGREGATE_AVG ?? 0),
        },
        {
          name: "Dispatch Avg (On Date/Date Range)",
          data: filteredData.map((d) => d.AVG_ON_DATE_RANGE ?? 0),
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: false,
        toolbar: { show: false },
      },
      colors: ["#773a02", "#FF7F50", "#967117"], // Add third color
      dataLabels: {
        enabled: true,
        formatter: (val) => (typeof val === "number" ? val.toFixed(2) : val),
        style: { colors: ["#000000"] },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          endingShape: "rounded",
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "#ffffff"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: filteredData.map((d) => d.RAKE_CD ?? ""),
      },
      yaxis: {
        labels: {
          formatter: (val) => val.toFixed(2),
        },
      },
      legend: {
        itemMargin: { vertical: 25 },
        position: "bottom",
        horizontalAlign: "center",
      },
      tooltip: {
        y: {
          formatter: (val) => val.toFixed(2),
        },
      },
    };
  }

  //sourav code coment

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  onFilter() {}

  getMinesGroup() {
    this.MinesService.searchMinesgroups({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          //   console.log(response)
          this.minesgroup = JSON.parse(JSON.stringify(response));
          this.criteria.Mine_Group = this.minesgroup[0];

          this.getMinesID();
        },
        error: (respError) => {
          this._snackBar.open(respError, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  getMinesID() {
    this.MinesService.searchMinesIDs({ Mine_Group: this.criteria.Mine_Group })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          //   console.log(response)
          this.minesID = JSON.parse(JSON.stringify(response));
          this.criteria.MINE_ID = this.minesID[0];

          this.getMinesStatutory();
        },
        error: (respError) => {
          this._snackBar.open(respError, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  getMinesStatutory() {
    // console.log(this.criteria);

    this.MinesService.searchStatutory(this.criteria)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          // console.log(response)
          let data = JSON.parse(JSON.stringify(response));
          // console.log(this.MineStatutory);
          this.MineStatutory = this.mergeMineData(data);

          // console.log(this.MineStatutory[0]);
          this.MineStatutory = this.MineStatutory[0];
        },
        error: (respError) => {
          this._snackBar.open(respError, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  mergeMineData(mineArray: any[]) {
    const mergedData = {};

    mineArray.forEach((mine) => {
      const mineId = mine.MINE_ID;

      if (!mergedData[mineId]) {
        mergedData[mineId] = { ...mine };
      } else {
        Object.keys(mine).forEach((key) => {
          if (key !== "MINE_ID" && mine[key]) {
            mergedData[mineId][key] += ` / ${mine[key]}`;
          }
        });
      }
    });

    return Object.values(mergedData);
  }

  statutoryTree() {
    this.MinesService.searchStatutoryTree(this.criteria)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          // console.log(response)
          this.MineStatutoryTree = JSON.parse(JSON.stringify(response));
          this.assignStaticVariables();
          this.assignStaticVariablesOGOM();
          this.assignStaticVariablesCGOM();
          this.assignStaticVariablesMANG();
          this.assignFluxMinesData();
        },
        error: (respError) => {
          this._snackBar.open(respError, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  assignStaticVariables() {
    const ironOreData = this.MineStatutoryTree.find(
      (mineral) => mineral.MINERAL_TYPE === "Iron Ore"
    );
    if (!ironOreData) return;

    const jgomMines = ironOreData.mines_groups.JGOM.mine_ids;

    // Assigning individual lease details
    if (jgomMines["Chiria"]) {
      const dhobil = jgomMines["Chiria"][0];
      this.dhobil_lease_id = dhobil.LEASE_ID;
      this.dhobil_lease_validity = dhobil.LEASE_VALIDITY;
      this.dhobil_ec_validity = dhobil.EC_VALIDITY;
      this.dhobil_install_cap = dhobil.INSTALL_CAP;
      this.dhobil_status = dhobil.STATUS;
    }

    if (jgomMines["Gua"]) {
      const duarguiburu = jgomMines["Gua"][0];
      this.duarguiburu_lease_id = duarguiburu.LEASE_ID;
      this.duarguiburu_lease_validity = duarguiburu.LEASE_VALIDITY;
      this.duarguiburu_ec_validity = duarguiburu.EC_VALIDITY;
      this.duarguiburu_install_cap = duarguiburu.INSTALL_CAP;
      this.duarguiburu_status = duarguiburu.STATUS;

      const topailore = jgomMines["Gua"][1];
      if (topailore) {
        this.topailore_lease_id = topailore.LEASE_ID;
        this.topailore_lease_validity = topailore.LEASE_VALIDITY;
        this.topailore_ec_validity = topailore.EC_VALIDITY;
        this.topailore_install_cap = topailore.INSTALL_CAP;
        this.topailore_status = topailore.STATUS;
      }
    }

    if (jgomMines["Kiriburu"]) {
      const kiriburu = jgomMines["Kiriburu"][0];
      this.kiriburu_lease_id = kiriburu.LEASE_ID;
      this.kiriburu_lease_validity = kiriburu.LEASE_VALIDITY;
      this.kiriburu_ec_validity = kiriburu.EC_VALIDITY;
      this.kiriburu_install_cap = kiriburu.INSTALL_CAP;
      this.kiriburu_status = kiriburu.STATUS;
    }

    if (jgomMines["Meghahatuburu"]) {
      const meghahatuburu = jgomMines["Meghahatuburu"][0];
      this.meghahatuburu_lease_id = meghahatuburu.LEASE_ID;
      this.meghahatuburu_lease_validity = meghahatuburu.LEASE_VALIDITY;
      this.meghahatuburu_ec_validity = meghahatuburu.EC_VALIDITY;
      this.meghahatuburu_install_cap = meghahatuburu.INSTALL_CAP;
      this.meghahatuburu_status = meghahatuburu.STATUS;
    }
  }

  assignStaticVariablesOGOM() {
    const ironOreData = this.MineStatutoryTree.find(
      (mineral) => mineral.MINERAL_TYPE === "Iron Ore"
    );
    if (!ironOreData) return;

    const ogomMines = ironOreData.mines_groups.OGOM.mine_ids;

    // Assigning individual lease details
    if (ogomMines["Barsua"]) {
      const barsua = ogomMines["Barsua"][0];
      this.barsua_lease_id = barsua.LEASE_ID;
      this.barsua_lease_validity = barsua.LEASE_VALIDITY;
      this.barsua_ec_validity = barsua.EC_VALIDITY;
      this.barsua_install_cap = barsua.INSTALL_CAP;
      this.barsua_status = barsua.STATUS;
    }

    if (ogomMines["Bolani"]) {
      const bolani = ogomMines["Bolani"][0];
      this.bolani_lease_id = bolani.LEASE_ID;
      this.bolani_lease_validity = bolani.LEASE_VALIDITY;
      this.bolani_ec_validity = bolani.EC_VALIDITY;
      this.bolani_install_cap = bolani.INSTALL_CAP;
      this.bolani_status = bolani.STATUS;
    }

    if (ogomMines["Kalta"]) {
      const kalta = ogomMines["Kalta"][0];
      this.kalta_lease_id = kalta.LEASE_ID;
      this.kalta_lease_validity = kalta.LEASE_VALIDITY;
      this.kalta_ec_validity = kalta.EC_VALIDITY;
      this.kalta_install_cap = kalta.INSTALL_CAP;
      this.kalta_status = kalta.STATUS;
    }

    if (ogomMines["Taldih"]) {
      const taldih = ogomMines["Taldih"][0];
      this.taldih_lease_id = taldih.LEASE_ID;
      this.taldih_lease_validity = taldih.LEASE_VALIDITY;
      this.taldih_ec_validity = taldih.EC_VALIDITY;
      this.taldih_install_cap = taldih.INSTALL_CAP;
      this.taldih_status = taldih.STATUS;
    }
  }

  assignStaticVariablesCGOM() {
    const ironOreData = this.MineStatutoryTree.find(
      (mineral) => mineral.MINERAL_TYPE === "Iron Ore"
    );
    if (!ironOreData) return;

    const cgomMines = ironOreData.mines_groups.CGOM.mine_ids;
    // console.log(cgomMines);

    if (cgomMines["Dalli"]) {
      const dalli = cgomMines["Dalli"][0];
      this.dalli_lease_id = dalli.LEASE_ID;
      this.dalli_lease_validity = dalli.LEASE_VALIDITY;
      this.dalli_ec_validity = dalli.EC_VALIDITY;
      this.dalli_install_cap = dalli.INSTALL_CAP;
      this.dalli_status = dalli.STATUS;
    }

    if (cgomMines["Jharandalli"]) {
      const jharandalli = cgomMines["Jharandalli"][0];
      this.jharandalli_lease_id = jharandalli.LEASE_ID;
      this.jharandalli_lease_validity = jharandalli.LEASE_VALIDITY;
      this.jharandalli_ec_validity = jharandalli.EC_VALIDITY;
      this.jharandalli_install_cap = jharandalli.INSTALL_CAP;
      this.jharandalli_status = jharandalli.STATUS;
    }

    if (cgomMines["Kalwar Nagur"]) {
      const kalwarNagur = cgomMines["Kalwar Nagur"][0];
      this.kalwar_nagur_lease_id = kalwarNagur.LEASE_ID;
      this.kalwar_nagur_lease_validity = kalwarNagur.LEASE_VALIDITY;
      this.kalwar_nagur_ec_validity = kalwarNagur.EC_VALIDITY;
      this.kalwar_nagur_install_cap = kalwarNagur.INSTALL_CAP;
      this.kalwar_nagur_status = kalwarNagur.STATUS;
    }

    if (cgomMines["Mahamaya-Dulk"]) {
      const mahamayaDulk = cgomMines["Mahamaya-Dulk"][0];
      this.mahamaya_dulk_lease_id = mahamayaDulk.LEASE_ID;
      this.mahamaya_dulk_lease_validity = mahamayaDulk.LEASE_VALIDITY;
      this.mahamaya_dulk_ec_validity = mahamayaDulk.EC_VALIDITY;
      this.mahamaya_dulk_install_cap = mahamayaDulk.INSTALL_CAP;
      this.mahamaya_dulk_status = mahamayaDulk.STATUS;
    }

    if (cgomMines["Rajhara"]) {
      const rajhara = cgomMines["Rajhara"][0];
      this.rajhara_lease_id = rajhara.LEASE_ID;
      this.rajhara_lease_validity = rajhara.LEASE_VALIDITY;
      this.rajhara_ec_validity = rajhara.EC_VALIDITY;
      this.rajhara_install_cap = rajhara.INSTALL_CAP;
      this.rajhara_status = rajhara.STATUS;
    }

    if (cgomMines["Rowghat"]) {
      const rowghat = cgomMines["Rowghat"][0];
      this.rowghat_lease_id = rowghat.LEASE_ID;
      this.rowghat_lease_validity = rowghat.LEASE_VALIDITY;
      this.rowghat_ec_validity = rowghat.EC_VALIDITY;
      this.rowghat_install_cap = rowghat.INSTALL_CAP;
      this.rowghat_status = rowghat.STATUS;
    }
  }

  assignStaticVariablesMANG() {
    const ironOreData = this.MineStatutoryTree.find(
      (mineral) => mineral.MINERAL_TYPE === "Manganese Ore"
    );
    if (!ironOreData) return;

    const newMines = ironOreData.mines_groups.MANG.mine_ids;

    if (newMines["Bolani"]) {
      const bolani = newMines["Bolani"][0];
      this.m_bolani_lease_id = bolani.LEASE_ID;
      this.m_bolani_lease_validity = bolani.LEASE_VALIDITY;
      this.m_bolani_ec_validity = bolani.EC_VALIDITY;
      this.m_bolani_install_cap = bolani.INSTALL_CAP;
      this.m_bolani_status = bolani.STATUS;
    }

    if (newMines["Gua"]) {
      const jhillingburu1 = newMines["Gua"][0];
      this.gua_jhillingburu1_lease_id = jhillingburu1.LEASE_ID;
      this.gua_jhillingburu1_lease_validity = jhillingburu1.LEASE_VALIDITY;
      this.gua_jhillingburu1_ec_validity = jhillingburu1.EC_VALIDITY;
      this.gua_jhillingburu1_install_cap = jhillingburu1.INSTALL_CAP;
      this.gua_jhillingburu1_status = jhillingburu1.STATUS;

      if (newMines["Gua"].length > 1) {
        const jhillingburu2 = newMines["Gua"][1];
        this.gua_jhillingburu2_lease_id = jhillingburu2.LEASE_ID;
        this.gua_jhillingburu2_lease_validity = jhillingburu2.LEASE_VALIDITY;
        this.gua_jhillingburu2_ec_validity = jhillingburu2.EC_VALIDITY;
        this.gua_jhillingburu2_install_cap = jhillingburu2.INSTALL_CAP;
        this.gua_jhillingburu2_status = jhillingburu2.STATUS;
      }
    }
  }

  assignFluxMinesData() {
    const fluxData = this.MineStatutoryTree.find(
      (mineral) => mineral.MINERAL_TYPE === "Flux"
    );
    if (!fluxData) return;

    const fluxMines = fluxData.mines_groups.Flux.mine_ids;

    if (fluxMines["Hirri"]) {
      const hirri = fluxMines["Hirri"][0];
      this.hirri_lease_id = hirri.LEASE_ID;
      this.hirri_lease_validity = hirri.LEASE_VALIDITY;
      this.hirri_ec_validity = hirri.EC_VALIDITY;
      this.hirri_install_cap = hirri.INSTALL_CAP;
      this.hirri_status = hirri.STATUS;
    }

    if (fluxMines["Kuteshwar"]) {
      const kuteshwar_right = fluxMines["Kuteshwar"][0];
      this.kuteshwar_right_lease_id = kuteshwar_right.LEASE_ID;
      this.kuteshwar_right_lease_validity = kuteshwar_right.LEASE_VALIDITY;
      this.kuteshwar_right_ec_validity = kuteshwar_right.EC_VALIDITY;
      this.kuteshwar_right_install_cap = kuteshwar_right.INSTALL_CAP;
      this.kuteshwar_right_status = kuteshwar_right.STATUS;

      if (fluxMines["Kuteshwar"].length > 1) {
        const kuteshwar_left = fluxMines["Kuteshwar"][1];
        this.kuteshwar_left_lease_id = kuteshwar_left.LEASE_ID;
        this.kuteshwar_left_lease_validity = kuteshwar_left.LEASE_VALIDITY;
        this.kuteshwar_left_ec_validity = kuteshwar_left.EC_VALIDITY;
        this.kuteshwar_left_install_cap = kuteshwar_left.INSTALL_CAP;
        this.kuteshwar_left_status = kuteshwar_left.STATUS;
      }
    }

    if (fluxMines["Nandini"]) {
      const nandini = fluxMines["Nandini"][0];
      this.nandini_lease_id = nandini.LEASE_ID;
      this.nandini_lease_validity = nandini.LEASE_VALIDITY;
      this.nandini_ec_validity = nandini.EC_VALIDITY;
      this.nandini_install_cap = nandini.INSTALL_CAP;
      this.nandini_status = nandini.STATUS;
    }
  }

  //sourav code
  getMineGroupMineDropDown() {
    this.MinesService.search({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          let data = JSON.parse(JSON.stringify(response));

          let uniqueMineGroups = data.filter(
            (minegroup, index, self) =>
              index ===
              self.findIndex((m) => m.MINES_CLUSTER === minegroup.MINES_CLUSTER)
          );
          console.log(uniqueMineGroups);

          if (uniqueMineGroups.length > 0) {
            this.mineGroupList = uniqueMineGroups;
            this.statutorycriteria.MINES_CLUSTER =
              this.mineGroupList[0].MINES_CLUSTER;
          }

          // ✅ Remove duplicate MINES by unique ID
          let uniqueMines = data.filter(
            (mine, index, self) =>
              index === self.findIndex((m) => m.ID === mine.ID)
          );
          console.log(uniqueMines);

          if (uniqueMines.length > 0) {
            this.mineList = uniqueMines;
            this.statutorycriteria.MINES_DESC = this.mineList[0].ID;
          }
          this.filteredMines = this.mineList.filter(
            (mine) =>
              mine.MINES_CLUSTER === this.statutorycriteria.MINES_CLUSTER
          );

          // ✅ Always call the details API with default Mine ID
          if (this.statutorycriteria.MINES_DESC) {
            this.getMinesStatutoryDetails(this.statutorycriteria.MINES_DESC);
          }
        },
        error: (respError) => {
          this._snackBar.open(respError, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }

  onMineGroupChange() {
    this.filteredMines = this.mineList.filter(
      (mine) => mine.MINES_CLUSTER === this.statutorycriteria.MINES_CLUSTER
    );

    // Set the first mine as default selection
    if (this.filteredMines.length > 0) {
      this.statutorycriteria.MINES_DESC = this.filteredMines[0].ID;
      // ✅ Call API with updated Mine ID
      this.getMinesStatutoryDetails(this.statutorycriteria.MINES_DESC);
    } else {
      this.statutorycriteria.MINES_DESC = null;
    }
  }

  getMinesStatutoryDetails(mineId: number) {
    this.licminemineralsService
      .search({ MineID: mineId })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          if (Array.isArray(response) && response.length > 0) {
            const data = response;

            const join = (key: string) =>
              data
                .map((item) => item[key])
                .filter(Boolean)
                .join(" / ");

            this.MineStatutoryDisplay = {
              Mine_Group: join("CLUSTER_NAME"),
              MINES_DESC: join("MINES_DESC"),
              MineralType: join("MineralType"),
              Area: join("Area"),
              Reserve_MT: join("ReserveMT"),
              RemReserveMT: join("RemReserveMT"),
              TotalMT: join("TotalMT"),
              EC_CAP_ROM: join("EC_Capacity_ROM"),
              EC_CAP_PROD: join("Production_Capacity_MT"),
              ABP: join("ABP_MT"),
              PROD: join("Production_MT"),
            };
          } else {
            this.MineStatutoryDisplay = {};
          }
        },
        error: (respError) => {
          this._snackBar.open(respError, "", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          });
        },
      });
  }
}
