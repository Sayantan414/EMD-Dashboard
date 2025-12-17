import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gas-utility',
  standalone: true,
  imports: [],
  templateUrl: './gas-utility.component.html',
  styleUrl: './gas-utility.component.scss'
})
export class GasUtilityComponent {
  selectedComponent: string = 'gas_holder'; // default

  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const viewParam = params['view'];

      if (viewParam) {
        // If the URL already has a ?view= param, use it
        this.selectedComponent = viewParam;
      } else {
        // If the user just opened /main/gas_balance with no params
        this.selectedComponent = 'gas_holder';
        // Add ?view=cob11 to the URL (without reloading)
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { view: 'gas_holder' },
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
