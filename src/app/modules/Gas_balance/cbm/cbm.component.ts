import { Component, OnInit } from '@angular/core';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';

@Component({
  selector: 'app-cbm',
  templateUrl: './cbm.component.html',
  styleUrls: ['./cbm.component.scss'],
  standalone: true,
  imports: [ProjectCommonModule],
})
export class CbmComponent implements OnInit {
  selectedNode: any = null;

  nodes: any = [
    {
      name: 'CBM',
      cssClass: 'ngx-org-head',
      childs: [
        {
          name: 'GEECL FLOW (SCM/hr)',
          cssClass: 'ngx-org-body_orange',
          childs: [
            {
              name: 'TOTALIZER',
              cssClass: 'ngx-org-body_orange',
              childs: [
                { name: 'M1', cssClass: 'ngx-org-body_orange' },
                { name: 'M2', cssClass: 'ngx-org-body_orange' }
              ]
            },
          ]
        },
        {
          name: 'MRS FLOW',
          cssClass: 'ngx-org-body_green',
          childs: [
            { name: 'M1', cssClass: 'ngx-org-body_green' },
            { name: 'M2', cssClass: 'ngx-org-body_green' }
          ]
        },
        {
          name: 'Pressure (Kg/cm²)',
          cssClass: 'ngx-org-body',
          childs: [
            { name: 'Inlet', cssClass: 'ngx-org-body' },
            { name: 'Outlet', cssClass: 'ngx-org-body' }
          ]
        },
        {
          name: 'Mills',
          cssClass: 'ngx-org-body_redorange'
        },
        {
          name: 'PBS#2',
          cssClass: 'ngx-org-body_violet'
        },
        {
          name: 'BOF & CCP',
          cssClass: 'ngx-org-body_yellow'
        },
        {
          name: 'CDI',
          cssClass: 'ngx-org-body_uf'
        },
        {
          name: 'LDCP',
          cssClass: 'ngx-org-body_pink'
        },
        {
          name: 'FLARE',
          cssClass: 'ngx-org-body_teal'
        }
      ]
    }
  ];

  onNodeClick(event: any) {
    this.selectedNode = event;
    console.log('Selected Node:', event);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
