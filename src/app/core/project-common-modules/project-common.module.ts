import { CommonModule, DatePipe, NgFor, NgIf } from "@angular/common";
import { NgModule } from "@angular/core";
import { MaterialModule } from "../angular-material-elements/material.module";
import { RouterLink } from "@angular/router";
import { FuseAlertComponent } from "@fuse/components/alert";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { TextFieldModule } from "@angular/cdk/text-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
    TextFieldModule,
    RouterLink,
    FuseAlertComponent,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
    TextFieldModule,
    RouterLink,
    FuseAlertComponent,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgApexchartsModule
  ],
})
export class ProjectCommonModule { }
