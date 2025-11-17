import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
// import { Router } from "@angular/router";
import { ProjectCommonModule } from "app/core/project-common-modules/project-common.module";

@Component({
  selector: "app-cob10",
  templateUrl: "./cob10.component.html",
  styleUrls: ["./cob10.component.css"],
  standalone: true,
  imports: [ProjectCommonModule, CommonModule],
})
export class Cob10Component implements OnInit {

  cob10 = "COB#10";
  back = 'Back to Overview';
  cob10Form: any = FormGroup;

  constructor(
    //  private router: Router,
    public matDialogRef: MatDialogRef<Cob10Component>
  ) {}
  splitLetters(text: string): string[] {
    return text.split("").map((c) => (c === " " ? "\u00A0" : c));
  }

  ngOnInit() {}

  // goBack() {
  //   // this.router.navigate(['/overview']);

  // }a
  
}
