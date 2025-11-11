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




  constructor() { }

  ngOnInit(): void {
  }
  // selectedNode: any = null;

  // nodes: any = [
  //   {
  //     name: 'BF#5',
  //     cssClass: 'ngx-org-head',
  //     childs: [
  //       {
  //         name: 'BLAST VOL',
  //         cssClass: 'ngx-org-body_orange',
  //         title: '(NM₃/MIN)',
  //         childs: [
  //           {

  //             name: 'MAKE',
  //             cssClass: 'ngx-org-body_orange',
  //             title: '(TNm₃/hr)',
  //             childs: [
  //               {
  //                 name: 'STOVE',
  //                 cssClass: 'ngx-org-body_green',
  //                 title: '(TOTAL)',
  //                 childs: [
  //                   { name: 'STOVE1', cssClass: 'ngx-org-body_green' },
  //                   { name: 'STOVE2', cssClass: 'ngx-org-body_green' },
  //                   { name: 'STOVE3', cssClass: 'ngx-org-body_green' }
  //                 ]
  //               },
  //               {
  //                 name: 'PBS#2',
  //                 cssClass: 'ngx-org-body',
  //                 title: '(TOTAL)',
  //                 childs: [
  //                   { name: 'BOILER1', cssClass: 'ngx-org-body' },
  //                   { name: 'BOILER2', cssClass: 'ngx-org-body' },
  //                   { name: 'BOILER3', cssClass: 'ngx-org-body' }
  //                 ]
  //               },
  //               {
  //                 name: 'COB#11',
  //                 cssClass: 'ngx-org-body_redorange',
  //                 title: '(TOTAL)',
  //                 childs: [
  //                   { name: 'N1 BLOCK', cssClass: 'ngx-org-body_redorange' },
  //                   { name: 'N2 BLOCK', cssClass: 'ngx-org-body_redorange' }
  //                 ]
  //               },
  //               {
  //                 name: 'FLARE',
  //                 cssClass: 'ngx-org-body_violet'
  //               },
  //               {
  //                 name: "MILL'S",
  //                 cssClass: 'ngx-org-body_yellow'
  //               }
  //             ],
  //           },
  //           {
  //             name: 'PRESSURE',
  //             cssClass: 'ngx-org-body_orange',
  //             title: '(MMWC)'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  // onNodeClick(event: any) {
  //   this.selectedNode = event;
  //   console.log('Selected Node:', event);
  // }




}
