import { Component } from '@angular/core';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

@Component({
  selector: 'app-gas-holder',
  standalone: true,
  imports: [ProjectCommonModule],
  templateUrl: './gas-holder.component.html',
  styleUrl: './gas-holder.component.scss'
})
export class GasHolderComponent {

}
