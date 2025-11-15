import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

@Component({
  selector: 'app-cob11modal',
  templateUrl: './cob11modal.component.html',
  styleUrls: ['./cob11modal.component.css'],
    standalone: true,
    imports: [ProjectCommonModule, CommonModule],
})
export class Cob11modalComponent implements OnInit {
  cob11 = "COB#11";
  back = 'Back to Overview'
  constructor( private dialogRef: MatDialogRef<Cob11modalComponent>) { }
  splitLetters(text: string): string[] {
    return text.split("").map((c) => (c === " " ? "\u00A0" : c));
  }
  ngOnInit() {
  }

}
