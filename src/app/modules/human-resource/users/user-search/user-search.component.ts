import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';
import { RoleService } from 'app/services/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersComponent } from '../users.component';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css'],
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, MatTooltipModule]
})

export class UserSearchComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject();
  userList = [];
  currentUser: any;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  roles = [];
  criteria = { role: '' };

  constructor(
    private commonService: CommonService,
    private userService: UserService,
    private roleService: RoleService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _snackBar: MatSnackBar,
    public UsersComponent: UsersComponent
  ) { }

  ngOnInit() {
    this.currentUser = this.commonService.getItem('currentUser');
    this.getDefaultRoles();
    // this.onFilter();
  }

  cancel() {
    // Mark for check
    this._changeDetectorRef.markForCheck();
    this.UsersComponent.matDrawer.close();
  }

  getDefaultRoles() {
    this.roles = [];
    this.commonService.getDefaultRole()
      .subscribe(response => {
        let defaultRoles = JSON.parse(JSON.stringify(response));
        if (this.currentUser.role == 'APPUSER') defaultRoles.splice(0, 1);
        else if (this.currentUser.role != 'APPADMIN') defaultRoles.splice(0, 2);
        // this.store.dispatch(new SetRolesAction(defaultRoles));
        //this.getCustomRole(defaultRoles);
        this.roles = [];
        for (let i = 0; i < defaultRoles.length; i++) {
          this.roles.push(defaultRoles[i]);
        }
        if (this.roles.length > 0) {
          this.criteria.role = this.roles[0].name;
        }
        // console.log(this.roles);
        // this.getCustomRole();
        this.onFilter();
      })
  }

  getCustomRole() {
    let obj = { ocode: this.currentUser.ocode };
    // console.log(obj);
    this.roleService
      .search(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (response) => {
          // console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              data[i].defaltFlag = false;
              this.roles.push(data[i]);
            }
          }

          // console.log(this.roles);
          this.onFilter();

        },
        (respError) => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      );
  }

  onFilter() {
    this.commonService.loading.next(true);

    let criteria = JSON.parse(JSON.stringify(this.criteria));
    criteria.ocode = this.currentUser.ocode;
    for (let key in criteria) {
      if (criteria[key] == 'All' || !criteria[key]) delete criteria[key];
      else criteria[key] = criteria[key].toString();
    }
    this.userService.search(criteria)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        // console.log(response)
        let data = JSON.parse(JSON.stringify(response));
        if (data.length > 0) this.userService.userlists.next(data);
        else this.userService.userlists.next([]);
        this.cancel();
        //     this.store.dispatch(setUsers({users: this.userList}));

      },
        respError => {
          this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
        })
  }

}
