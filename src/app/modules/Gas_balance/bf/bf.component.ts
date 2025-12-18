import { Component, OnInit } from '@angular/core';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';


@Component({
  selector: 'app-bf',
  templateUrl: './bf.component.html',
  styleUrls: ['./bf.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class BfComponent implements OnInit {
  viewMode: string = "bf5"; // default selected: bf#5
  constructor() { }

  ngOnInit(): void {
  }

  onViewModeChange() {
    if (this.viewMode === "trends") {

    }
  }
}
