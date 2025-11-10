//sourav code comment
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from 'app/app.component';
// import { appConfig } from 'app/app.config';

// bootstrapApplication(AppComponent, appConfig)
//     .catch(err => console.error(err));
//sourav code comment

// sourav code
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "app/app.component";
import { appConfig } from "app/app.config";
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";

// If you also want custom formats
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "dd/MM/yyyy",
    monthYearLabel: "MMM yyyy",
    dateA11yLabel: "dd/MM/yyyy",
    monthYearA11yLabel: "MMMM yyyy",
  },
};

// Add to appConfig providers
appConfig.providers = [
  ...(appConfig.providers || []),
  { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
];

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
// sourav code
