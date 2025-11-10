import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { CommonService } from 'app/services/common.service';
import { Subject, takeUntil } from 'rxjs';
import { AddlistComponent } from './addlist/addlist.component';
import { AddfeatureComponent } from './addfeature/addfeature.component';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { AsyncPipe, DatePipe, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav'
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrganizationService } from 'app/services/organization.service';




@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [MatSidenavModule, FuseAlertComponent, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, MatTooltipModule, AsyncPipe, I18nPluralPipe, DatePipe, MatMenuModule, MaterialModule],
})
export class AppDashboardComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  drawerOpened: boolean = false;
  drawerMode: 'side' | 'over';
  orgList = [];
  countries = [];
  states = [];
  cities = [];
  user: any;
  dashboard = { country: '', state: '', city: '', oname: '', ocode: '' };
  userList = [];
  configForm: FormGroup;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  filterForm: UntypedFormGroup;
  showAlert = false;
  constructor(
    private commonService: CommonService,
    private _formBuilder: FormBuilder,
    private organizationService: OrganizationService,
    //  private store: Store<{ organization: any }>,
    private _fuseConfirmationService: FuseConfirmationService,
    private _matDialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {

    this.filterForm = this._formBuilder.group({
      state: [''],
      oname: [''],
      country: [''],
      city: [''],
      ocode: [''],
    });
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode if the given breakpoint is active
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
        }
        else {
          this.drawerMode = 'over';
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
    this.user = this.commonService.getItem('currentUser');
    this.getData();
    this.getCountry();

    this.configureDeleteConfirmation();
  }

  searchForm(): FormGroup {
    return this._formBuilder.group({
      state: [''],
      oname: [''],
      country: [''],
      city: [''],
      ocode: [''],
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }

  search() {
    this.matDrawer.open();
  }

  getCountry() {
    this.countries = [];
    this.organizationService.countries({})
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        // console.log(response);
        let data = JSON.parse(JSON.stringify(response));
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            this.countries.push(data[i]);
          }
          this.countries.unshift('All');
          this.dashboard.country = this.countries[0];
          this.getState(this.dashboard.country);
        }
        // console.log(this.countries);
      },
        respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
        })
  }
  getState(country: string) {
    this.states = [];
    if (country != "All") {
      let obj = { country: country };
      this.organizationService.states(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          // console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              this.states.push(data[i]);
            }
            this.states.unshift('All');
            this.dashboard.state = this.states[0];
            this.getCity(country, this.dashboard.state);
          }
          // console.log(this.states);
        },
          respError => {
            this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
          })
    }
    else {
      this.states.push('All');
      this.dashboard.state = this.states[0];
      this.getCity(country, this.dashboard.state);
    }

  }
  getCity(country: string, state: string) {
    this.cities = [];
    if (country != "All" && state != "All") {
      let obj = { country: country, state: state };
      this.organizationService.cities(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          // console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              this.cities.push(data[i]);
            }
            this.cities.unshift('All');
            this.dashboard.city = this.cities[0];
          }
          // console.log(this.cities);
        },
          respError => {
            this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
          })
    }
    else {
      this.cities.push('All');
      this.dashboard.city = this.cities[0];
    }
  }

  close() {
    this.matDrawer.close()
  }

  getData() {
    this.organizationService.orgList.subscribe(response => {
      console.log(response);

      let orglist = JSON.parse(JSON.stringify(response));

      if (orglist.length > 0) {
        this.orgList = JSON.parse(JSON.stringify(response));
      }
      else this.onFilter();

    })
    // this.store.select('organization')
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(response => {


    //     this.userList = [];
    //     let userList = JSON.parse(JSON.stringify(response.organizations));
    //     if (userList.length > 0) {
    //       for (let i = 0; i < userList.length; i++) {

    //         this.userList.push(userList[i]);
    //       }
    //     }
    //     else {
    //       let obj = {};
    //       obj['skip'] = 0;
    //       obj['limit'] = 14;
    //       this.getSearch(obj);
    //     }


    //     console.log(this.userList);


    //   })

  }


  onFilter() {
    // this.loading = true;
    let obj = JSON.parse(JSON.stringify(this.dashboard));
    for (const key in obj) {
      if (obj[key] == "All" || obj[key] == " ") delete obj[key]
    }


    this.organizationService.search(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        // console.log('test', response)
        let orglist = JSON.parse(JSON.stringify(response));
        if (orglist.length > 0) {
          this.organizationService.orgList.next(orglist);
        }

        // this.store.dispatch(new SetOrganizationAction(users));
        // this.store.dispatch(setOrganization({ organizations: users }));
        // this.loading = false;
        // this.filter.emit(this.loading);
      },
        respError => {
          // this.loading = false;
          // this.filter.emit(this.loading);
          this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
        })



  }


  setProduct(list: any) {
    this.dialogRef = this._matDialog.open(AddfeatureComponent, {
      // panelClass: 'contact-form-dialog',
      data: {
        data: list,
        currentUser: this.user,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

      });
  }
  vendorEdit(list: any) {
    this.dialogRef = this._matDialog.open(AddlistComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        data: list,
        currentUser: this.user,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

      });
  }
  addnew() {
    this.dialogRef = this._matDialog.open(AddlistComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        currentUser: this.user,
        action: 'add'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

      });
  }

  configureDeleteConfirmation() {
    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Remove User',
      message: 'Are you sure you want to remove this organization permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel'
        })
      }),
      dismissible: true
    });
  }

  openConfirmationDialog(list: any): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      if (result == "confirmed") {
        this.userDelete(list)
      }
    });
  }

  deleteVendor(list: any) {
    if (list.userid != this.user['userid']) {
      this.openConfirmationDialog(list);
    }
    else {
      this._snackBar.open('You can\'t remove yourself', '', { duration: 3000, panelClass: 'error' });
    }
  }
  userDelete(list: any) {
    list.duserid = this.user['userid'];
    this.organizationService.delete(list)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.organizationService.removeItem(list)
        // this.store.dispatch(deleteOrganization({ organization: list }));
      },
        respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
        })
  }


  selectOrganization(element: any) {
    let index = this.commonService.findItem(this.orgList, '_id', element._id);
    this.orgList[index].selected = !this.orgList[index].selected;
    let user = this.commonService.getItem('currentUser');
    //let user = this.commonService.getItem('currentUser');
    // console.log(user);

    if (this.orgList[index].selected) {
      //Unselect all other orgList
      for (let i = 0; i < this.orgList.length; i++) {
        if (i != index) {
          this.orgList[i].selected = false;
        }
      }
      user['ocode'] = this.orgList[index].ocode;
      user['otype'] = this.orgList[index].otype;

      //   this.getActiveAcademicYear(this.orgList[index].ocode);
    }
    else {
      delete user['ocode'];
      delete user['otype'];
      this.commonService.removeItem('academicyear');
    }

    this.user = user;
    this.commonService.setItem('currentUser', user);
    this.commonService.currentUser.next(user);
    // this.store.dispatch(setOrganization({ organizations: users }));
    // this.store.dispatch(signin({ user: user }));
    this.alert = {
      type: 'success',
      message: `${this.orgList[index].oname}`
    };

    // Show the alert
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);
    // this.commonService.showSnakBarMessage(this.orgList[index].oname + ' Has Been Selected To View Details.', 'success', 5000);
  }

}

