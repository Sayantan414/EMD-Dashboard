import { AsyncPipe, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UserService } from 'app/services/user.service';
import { CommonService } from 'app/services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [ProjectCommonModule, UserListComponent, UserSearchComponent, UserDetailsComponent],
})
export class UsersComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerOpened: boolean = false;
  @ViewChild('matDrawer1', { static: true }) matDrawer1: MatDrawer;
  drawerOpened1: boolean = false;
  drawerMode: 'side' | 'over';

  loading = true;
  profileID: string;
  user: any;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private userService: UserService,
    private commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _matDialog: MatDialog
  ) { }

  ngOnInit() {
  }


  addnew() {
    let dialogRef = this._matDialog.open(UserFormComponent, {
      width: '60%',
      data: {
        action: 'add'
      }
    });

    dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

      });
  };

  search() {
    this.matDrawer1.close()
    this.matDrawer.open();

  }

  viewUser(event) {
    // console.log(event);

    this.profileID = event;
    this.userService.show(event)
      .subscribe({
        next: response => {
          // console.log(response);
          this.user = JSON.parse(JSON.stringify(response));
          this.user.imageURL = this.userService.profilePic(this.user.image);
          this.matDrawer.close();
          this.matDrawer1.open()
        },
        error: respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      })

  }



}
