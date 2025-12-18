import { Component, OnInit } from '@angular/core';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

@Component({
  selector: 'app-bofg',
  templateUrl: './bofg.component.html',
  styleUrls: ['./bofg.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class BofgComponent implements OnInit {
  viewMode: string = "flow"; // default selected: CO Gas Flow

  constructor() { }

  
  ngOnInit(): void {
  }

  onViewModeChange() {
    if (this.viewMode === "trends") {

    }
  }
}
