import { UserListComponent } from '../user-list/user-list.component';
import { UserService } from 'app/services/user.service';
import { OrganizationService } from 'app/services/organization.service';
import { CommonService } from 'app/services/common.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContactsService } from 'app/modules/admin/apps/contacts/contacts.service';
import { Contact, Country, Tag } from 'app/modules/admin/apps/contacts/contacts.types';
import { ContactsListComponent } from 'app/modules/admin/apps/contacts/list/list.component';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersComponent } from '../users.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, FuseFindByKeyPipe, DatePipe],
})
export class UserDetailsComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject();

  // user = {
  //   addedby: "", addedon: "", email: "", firstname: "", image: "", lastname: "", lastupdatedby: "", lastupdatedon: "", mobile: "", ocode: "", office: '',
  //   onetime: false, password: "", role: "", selected: false, status: "", userid: "", _id: '', imageURL: '', department: '', designation: '', subdepartment: '', section: ''
  // };
  @Input() user: any;
  coverUrl: any;
  currentUser: any;
  resetpasswordFlag: boolean;

  constructor(
    private _router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService,
    private organizationService: OrganizationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public UsersComponent: UsersComponent,
    private _matDialog: MatDialog

  ) { }

  ngOnInit() {
    this.currentUser = this.commonService.getItem('currentUser');
    let userRole = this.commonService.getItem('currentRole');
    // console.log(userRole);

    if (userRole.privilege.includes('Reset Password')) {
      this.resetpasswordFlag = true;
    }

    this.coverUrl = 'assets/images/pages/profile-bg/' + this.commonService.getRandom(1, 20) + '.jpg';
    //this.getUser();
  }

  closeDrawer() {
    this.UsersComponent.matDrawer1.close();
  }

  cancel() {
    this.UsersComponent.matDrawer1.close();
  }

  // getUser() {
  //   this.userService.show(this.Id)
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe(response => {
  //       console.log(response);
  //       this.user = JSON.parse(JSON.stringify(response));
  //       this.user.imageURL = this.userService.profilePic(this.user.image);
  //     },
  //       respError => {
  //         this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
  //       })
  // }

  onFileSelect(files: FileList) {
    // console.log(files);

    if (files.length > 0) {
      let fileItem = files.item(0);
      let formData = new FormData();
      formData.append('file', fileItem, fileItem.name);
      for (let key in this.user) {
        if (key != 'imageURL') {
          formData.append(key, this.user[key]);
        }
      }
      // console.log(formData);

      this.userService.upload(formData)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          // console.log(response);

          let user = JSON.parse(JSON.stringify(response));
          this.user.image = user.image;
          this.userService.updateItem(user);
          this.user.imageURL = this.userService.profilePic(this.user.image);
          if (this.currentUser.userid == this.user.userid) {
            this.currentUser.image = user.image;
            this.commonService.setItem('currentUser', this.currentUser);
            // this.store.dispatch(signin({ user: this.user }));
            this.commonService.currentUser.next(user);
          }
        }, respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
        });
    }

  }

  resetPassword(user) {
    let dialogRef = this._matDialog.open(ResetPasswordComponent, {
      width: '40%',
      data: {
        action: 'add',
        user: user
      }
    });

    dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

      });
  }

}
