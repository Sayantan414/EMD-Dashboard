import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'app/services/common.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganizationService } from 'app/services/organization.service';


@Component({
  selector: 'app-addfeature',
  templateUrl: './addfeature.component.html',
  styleUrls: ['./addfeature.component.scss'],
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, MatTooltipModule],

})
export class AddfeatureComponent {
  private _unsubscribeAll: Subject<any>;
  action: string;
  currentUser: any;
  dataProduct: any;
  productsSearch = [];


  constructor(@Inject(MAT_DIALOG_DATA) private _data: any, private commonService: CommonService,
    private organizationService: OrganizationService, public matDialogRef: MatDialogRef<AddfeatureComponent>,
    private _snackBar: MatSnackBar
  ) {
    this._unsubscribeAll = new Subject();
    this.action = _data.action;
    this.currentUser = JSON.parse(JSON.stringify(_data.currentUser));
    this.dataProduct = JSON.parse(JSON.stringify(_data.data));
    if (!this.dataProduct.features) {
      this.dataProduct.features = [];
    }
    // this.productSearch();
    this.featureSearch();
    // console.log(this.dataProduct);
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }
  featureSearch() {
    this.productsSearch = [];
    this.commonService.getFeatures()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response: any) => {
          // console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          // console.log(data);
          for (let i = 0; i < data.length; i++) {
            let index = this.dataProduct.features.indexOf(data[i].name)
            if (index != -1) {
              data[i].checkFlag = true;
              //  this.dataProduct.features.push(data[i].name);
            }
            else if (data[i].default) {
              data[i].checkFlag = true;
              this.dataProduct.features.push(data[i].name);
            }
            else {
              data[i].checkFlag = false;
            }
            this.productsSearch.push(data[i]);
          }

        }
      )

  }
  //  productSearch(){
  //    this.productsSearch=[];
  //    let obj={ocode:this.currentUser.ocode};
  //    this.productService.search(obj)
  //    .pipe(takeUntil(this._unsubscribeAll))
  //    .subscribe(response =>{
  //      let data=JSON.parse(JSON.stringify(response));
  //      console.log(data);
  //      for(let i=0;i<data.length;i++){
  //      let index= this.dataProduct.products.indexOf(data[i].pcode)
  //      if(index!=-1){
  //        data[i].checkFlag=true;
  //      }
  //      else{
  //       data[i].checkFlag=false;
  //      }
  //       this.productsSearch.push(data[i]);
  //      }

  //   },
  //      respError => {
  //          this.commonService.showSnakBarMessage(respError, 'error', 2000);
  //      })

  //  }

  checkProduct(name: any) {
    let index = this.dataProduct.features.indexOf(name)
    if (index != -1) {
      this.dataProduct.features.splice(index, 1);
    }
    else {
      this.dataProduct.features.push(name);
    }
  }

  onSave() {
    let obj = JSON.parse(JSON.stringify(this.dataProduct))
    // console.log(this.dataProduct);

    this.organizationService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let data = JSON.parse(JSON.stringify(response));
        this.organizationService.updateItem(data);
        // console.log(data);

        //  this.store.dispatch(updateOrganization({ organization: data }));
        this.matDialogRef.close();
      },
        respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
        })
  }
}
