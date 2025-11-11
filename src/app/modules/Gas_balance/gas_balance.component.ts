import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

@Component({
  selector: 'app-gas_balance',
  templateUrl: './gas_balance.component.html',
  styleUrls: ['./gas_balance.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class GasBalanceComponent implements OnInit {
  selectedComponent: string = 'cob11'; // default

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const viewParam = params['view'];

      if (viewParam) {
        // If the URL already has a ?view= param, use it
        this.selectedComponent = viewParam;
      } else {
        // If the user just opened /main/gas_balance with no params
        this.selectedComponent = 'cob11';
        // Add ?view=cob11 to the URL (without reloading)
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { view: 'cob11' },
          queryParamsHandling: 'merge',
          replaceUrl: true, // prevents extra history entries
        });
      }
    });

    console.log('✅ Loaded Component:', this.selectedComponent);
  }


  switchComponent(component: string) {
    this.selectedComponent = component;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: component },
      queryParamsHandling: 'merge',
    });
  }
}
