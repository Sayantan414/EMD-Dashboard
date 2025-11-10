import { CommonModule, Location, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordComponent } from '../human-resource/users/reset-password/reset-password.component';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [MaterialModule, CommonModule, NgIf, FuseCardComponent]
})
export class ProfileComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject();

  coverUrl: any;
  currentUser: any;
  user: any;
  resetpasswordFlag: boolean;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private location: Location,
    private _matDialog: MatDialog



  ) { }

  ngOnInit() {
    this.user = this.commonService.getItem('currentUser');
    console.log(this.user);
    let userRole = this.commonService.getItem('currentRole');
    console.log(userRole);

    if (userRole.privilege.includes('Reset Password')) {
      this.resetpasswordFlag = true;
    }

    this.coverUrl = 'assets/images/pages/profile-bg/' + this.commonService.getRandom(1, 10) + '.jpg';
    this.user.imageURL = this.userService.profilePic(this.user.image);
  }

  cancel() {
    this.location.back();
    this._changeDetectorRef.markForCheck();
  }

  onFileSelect(files: FileList) {
    console.log(files);

    if (files.length > 0) {
      let fileItem = files.item(0);
      let formData = new FormData();
      formData.append('file', fileItem, fileItem.name);
      for (let key in this.user) {
        if (key != 'imageURL') {
          formData.append(key, this.user[key]);
        }
      }
      console.log(formData);

      this.userService.upload(formData)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          console.log(response);

          this.user = JSON.parse(JSON.stringify(response));

          this.user.imageURL = this.userService.profilePic(this.user.image);
          this.user.image = this.user.image;
          this.commonService.setItem('currentUser', this.user);
          this.commonService.currentUser.next(this.currentUser);
          this.userService.updateItem(this.currentUser);
        }, respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error' });
        });
    }
  }

  resetPassword() {
    let dialogRef = this._matDialog.open(ResetPasswordComponent, {
      width: '40%',
      data: {
        action: 'add',
        user: this.user
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
