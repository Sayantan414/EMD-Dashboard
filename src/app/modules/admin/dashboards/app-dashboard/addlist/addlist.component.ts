import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfigService } from '@fuse/services/config';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganizationService } from 'app/services/organization.service';

@Component({
  selector: 'app-addlist',
  templateUrl: './addlist.component.html',
  styleUrls: ['./addlist.component.scss'],
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, MatTooltipModule],

})
export class AddlistComponent {

  // loading$: Observable<boolean>;
  // error$: Observable<Error>;
  private _unsubscribeAll: Subject<any>;
  saving = false;
  updateFlag = false;
  action: string;
  dialogTitle: string;
  passwordFlag: boolean;
  visible = false;
  user: any;
  currentUser: any;
  vendorForm: FormGroup;
  vendors = { oname: '', pin: '', address: '', country: '', state: '', city: '', };
  //googleapikey:''};
  countries = [];
  states = [];
  profileFlag = false;
  /**
    * Constructor
    *
    * @param {FuseConfigService} _fuseConfigService
    * @param _data
    *      
     * @param {MatDialogRef<VendoreditComponent>} matDialogRef
    * @param {FormBuilder} _formBuilder
    * 
    */

  constructor(
    private organizationService: OrganizationService,
    public matDialogRef: MatDialogRef<AddlistComponent>,
    // private store: Store<{ organization: any }>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _fuseConfigService: FuseConfigService,
    private _snackBar: MatSnackBar
    // private roleService:RoleService
  ) {
    this._unsubscribeAll = new Subject();
    this.vendorForm = this.createForm();
    this.getCountries();
    this.action = _data.action;
    this.currentUser = JSON.parse(JSON.stringify(_data.currentUser));
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Organisation';
      this.updateFlag = true;
      this.vendors = JSON.parse(JSON.stringify(_data.data));
      // console.log(_data.data);
      this.vendors.state = JSON.parse(JSON.stringify(_data.data.state));
      this.vendors.country = JSON.parse(JSON.stringify(_data.data.country));
      if (_data.data.pin) {
        this.vendors.pin = JSON.parse(JSON.stringify(_data.data.pin));
      }

      // this.vendors.googleapikey = JSON.parse(JSON.stringify(_data.data.googleapikey));
    }
    else {
      this.dialogTitle = 'Add Organization';
    }
    // if(_data.page == 'profile')   this.profileFlag= true;
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      state: new FormControl(''),
      oname: new FormControl(''),
      country: new FormControl(''),
      city: new FormControl(''),
      address: new FormControl(''),
      pin: new FormControl(''),
      // googleapikey: new FormControl(''),
    });
  }

  getCountries() {
    // alert('1')
    // console.log('123');
    this.commonService.getCountries()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data: any) => {
          // console.log(data);
          this.countries = JSON.parse(JSON.stringify(data));
          // console.log(this.countries);
          if (this.countries.length > 0) {
            if (!this.updateFlag) {
              this.vendors.country = 'India';
            }
            this.onSelect();
          }

        }
      )
  }

  onSelect() {
    let index = this.commonService.findItem(this.countries, 'name', this.vendors.country);
    if (index >= 0) {
      if (this.countries[index].states) {
        this.states = this.countries[index].states;
      }
      else this.states = [];
    }
    else this.states = [];
    if (this.states.length > 0) {
      if (!this.updateFlag) {
        this.vendors.state = this.countries[index].states[0].name;
      }
    }
    else {
      if (!this.updateFlag) {
        this.vendors.state = '';
      }
    }
  }
  onSave() {
    this.saving = true;
    if (this.vendors.oname == '') {
      this._snackBar.open('enter a name', '', { duration: 3000, panelClass: 'error' });
      return;
    }
    if (this.updateFlag) {
      let obj = JSON.parse(JSON.stringify(this.vendors));
      obj['userid'] = this.currentUser.userid;
      // console.log(obj);
      this.organizationService.update(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          this.saving = false;
          let data = JSON.parse(JSON.stringify(response));
          this.organizationService.updateItem(data)
          // this.store.dispatch(updateOrganization({ organization: data }));
          this.matDialogRef.close(data);
        },
          respError => {
            this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
          })

    }
    else {
      let obj = JSON.parse(JSON.stringify(this.vendors));
      obj['userid'] = this.currentUser.userid;
      // console.log(obj);
      this.organizationService.create(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          this.saving = false;
          let data = JSON.parse(JSON.stringify(response));
          this.organizationService.addItem(data)
          // this.store.dispatch(addOrganization({ organization: data }));
          this.matDialogRef.close(data);
        },
          respError => {
            this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
          })

    }
  }






}
