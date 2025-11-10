import { AsyncPipe, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
//import { MatMenu } from '@angular/material/menu';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { FuseAlertComponent, FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [ProjectCommonModule],

})
export class UserListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  @Input() loading: boolean;
  @Output() profileID = new EventEmitter<string>();
  contactsCount: number = 0;
  contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userList = [];
  currentUser: any;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
  configForm: FormGroup;
  deletable = false;
  editable = false;
  resetPasswordFlag: boolean;
  showOnetimepassword = false;
  alert: { type: FuseAlertType; message: string, list: any } = {
    type: 'success',
    message: '',
    list: {}
  };
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private userService: UserService,
    private commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private _snackBar: MatSnackBar,
    private _fuseAlertService: FuseAlertService,
    private _matDialog: MatDialog
  ) { }

  ngOnInit() {

    // Subscribe to MatDrawer opened change

    this.currentUser = this.commonService.getItem('currentUser');
    let userRole = this.commonService.getItem('currentRole');
    if (userRole.privilege.includes('Delete User')) {
      this.deletable = true;
    }
    if (userRole.privilege.includes('Edit User')) {
      this.editable = true;
    }

    if (userRole.privilege.includes('Reset Password')) {
      this.resetPasswordFlag = true;
    }
    this.configureDeleteConfirmation();
    this.onFilter()
    this.getUsers();
  }

  createContact() {
    this.matDrawer.open();
    this._router.navigate(['./form',], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }

  searchContact() {
    this.matDrawer.open();
    this._router.navigate(['./search',], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }
  onBackdropClicked() {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  viewUser(list) {
    // console.log(list);

    this.profileID.emit(list.id);
  }

  getUsers() {
    this.userService.userlists.subscribe(response => {
      // console.log(response);
      let userList = JSON.parse(JSON.stringify(response));

      if (userList.length > 0) {
        this.userList = userList;
        this.userList.forEach(user => {
          user.imageUrl = this.userService.profilePic(user.image)
        })
      }
      else this.userList = [];

    })
  }

  onFilter() {
    // this.commonService.loading.next(true);
    this.userService.search({ ocode: this.currentUser.ocode })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: response => {
          // console.log(response)
          let data = JSON.parse(JSON.stringify(response));
          if (data.length > 0) this.userService.userlists.next(data);
          this.getUsers();
          // this.cancel();
          //     this.store.dispatch(setUsers({users: this.userList}));

        },
        error: respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });

        }
      })
  }

  edtiUser(list) {
    let dialogRef = this._matDialog.open(UserFormComponent, {
      width: '60%',
      data: {
        action: 'edit',
        user: list
      }
    });

    dialogRef.afterClosed()
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
      message: 'Are you sure you want to remove this user permanently? <span class="font-medium">This action cannot be undone!</span>',
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

  deleteUser(index: number, list: any): void {
    if (list.userid != this.currentUser['userid']) {
      this.openConfirmationDialog(list);
    }
    else {
      this._snackBar.open('You can\'t remove yourself', 'close', { duration: 2000, panelClass: ['error-snackbar'] });

    }
  }
  userDelete(list: any) {
    list.duserid = this.currentUser['userid'];
    this.userService.delete(list)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: response => {
          this.userService.removeItem(list);
          this._snackBar.open('One User Deleted Successfully!', '', { duration: 3000, panelClass: ['success-snackbar'] });

        },
        error: respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      })
  }

  resetPassword(index: number, list: any) {
    this.configForm = this._formBuilder.group({
      title: 'Reset Password',
      message: `Are you sure you want to reset password for ${list.firstname} ${list.lastname}?`,
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_solid:wrench',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Yes',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'No'
        })
      }),
      dismissible: true
    });

    this.openResetPasswordConfirmationDialog(list)
  }

  openResetPasswordConfirmationDialog(list: any): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      if (result == "confirmed") {
        this.userService.resetPassword(list)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe({
            next: response => {
              // console.log(response);
              let data = JSON.parse(JSON.stringify(response));
              this.alert = {
                type: 'success',
                message: data.onetimepassword,
                list: list
              };
              // console.log(this.alert);
              this._fuseAlertService.show('alertBox3');
              // Show the alert
              this.showOnetimepassword = true;
              // this._snackBar.open('One User Deleted Successfully!', '', { duration: 3000, panelClass: ['success-snackbar'] });

            },
            error: respError => {
              this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
            }
          })
      }
    });
  }
}
