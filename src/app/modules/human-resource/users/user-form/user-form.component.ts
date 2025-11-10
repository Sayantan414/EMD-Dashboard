import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UserListComponent } from '../user-list/user-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, I18nPluralPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from 'app/services/common.service';
import { UsersComponent } from '../users.component';
import { UserService } from 'app/services/user.service';
import { MatSelectModule } from '@angular/material/select';
import { RoleService } from 'app/services/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, NgFor, NgClass, RouterLink, AsyncPipe, I18nPluralPipe, MatTooltipModule],

})
export class UserFormComponent implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject();
  action: string;
  updateFlag = false;
  currentUser: any;
  saving = false;
  // user = { firstname: '', lastname: '', mobile: '', email: '', imageUrl: '', role: '', password: '' };
  user = { userid: '', firstname: '', lastname: '', role: '', password: '' };
  contactForm: UntypedFormGroup;
  dialogTitle: string;
  roles = [];
  passwordFlag = true;
  visible = false;
  addFlag = true;
  editFlag = true;
  data = { userid: '', firstname: '', lastname: '', role: '', password: '' };
  departments = [];
  designations = [];
  subdepartments = [];
  sections = [];
  departmets = [];

  constructor(

    // private store: Store<AppState>,
    public matDialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private userService: UserService,
    private roleService: RoleService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _snackBar: MatSnackBar,


  ) {
    this._unsubscribeAll = new Subject();

    this.currentUser = this.commonService.getItem('currentUser');
    this.contactForm = this.createContactForm();
    this.getDefaultRoles();
    // this.getDepartment();
    this.action = _data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit User';
      this.updateFlag = true;
      this.user = JSON.parse(JSON.stringify(_data.user));
      // this.passwordFlag = false;
      // this.user.imageUrl = this.userService.profilePic(this.user['image']);
      this.contactForm.controls['password'].clearValidators();
      this.contactForm.controls['password'].updateValueAndValidity();
      this._changeDetectorRef.markForCheck();
    }
    else {
      this.dialogTitle = 'New User';
      // this.user.imageUrl = this.userService.profilePic('noluser.png');
    }

  }




  ngOnInit(): void {
    this.currentUser = this.commonService.getItem('currentUser');
    this.contactForm = this.createContactForm();
    this.getDefaultRoles();
    // this.getDepartment();
    // this.getDesignation();
    this.editUser();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(undefined);
    this._unsubscribeAll.complete();
  }
  // showicon(){
  //   if(this.addFlag && !this.editFlag){
  //    this.visible=!this.visible;
  //   }
  //   // else if(!this.addFlag && this.editFlag){

  //   // }
  // }
  createContactForm(): FormGroup {
    return this._formBuilder.group({
      userid: [''],
      firstname: [''],
      lastname: [''],
      // email: ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      // mobile: ['', Validators.pattern(/^\d{10}$/)],
      password: [''],
      role: [this.user.role],
      // department: [''],
      // designation: ['']
    });
  }
  // getStoreData() {
  //   this.store.select('user')
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe(response => {
  //       console.log(response);

  //       if (response.action) {
  //         this.action = JSON.parse(JSON.stringify(response.action));
  //       }
  //       if (this.action != 'search') {

  //         if (this.action === 'edit') {

  //           this.editFlag = true;
  //           this.addFlag = false;
  //           if (response.data) {
  //             this.user = JSON.parse(JSON.stringify(response.data));
  //             this.data = JSON.parse(JSON.stringify(response.data));


  //             this.user.imageUrl = this.userService.profilePic(this.user['image']);
  //           }
  //           this.contactForm = this.createContactForm();
  //         }
  //         else {

  //           this.addFlag = true;
  //           this.editFlag = false;
  //           this.user.imageUrl = this.userService.profilePic('noluser.png');
  //         }
  //         this.getDefaultRoles();
  //       }
  //  else{
  //   this.searchFlag=true;
  //   this.addFlag=false;
  //   this.editFlag=false;
  //   this.getCountry();
  //  }
  // this.getcustomer();

  //     })
  // }
  getDefaultRoles() {
    this.roles = [];
    this.commonService.getDefaultRole()
      .subscribe({
        next: response => {
          this.roles = [];
          let defaultRoles = JSON.parse(JSON.stringify(response));
          if (this.user.role == 'APPUSER') defaultRoles.splice(0, 1);
          else if (this.user.role != 'APPADMIN') defaultRoles.splice(0, 2);
          // this.store.dispatch(new SetRolesAction(defaultRoles));
          //this.getCustomRole(defaultRoles);
          for (let i = 0; i < defaultRoles.length; i++) {
            this.roles.push(defaultRoles[i]);
          }
          if (this.roles.length > 0) {
            if (this.action === 'add') {
              this.user.role = this.roles[0].name;
            }
            else if (this.action === 'edit') {
              // console.log(this.user.role)
              /* let index= this.commonService.findItem(this.roles,'name', this.data.role);
              if(index!=-1){
                this.user.role = this.roles[index].name; 
              } */

            }

          }
          // this.getCustomRole();
        },
        error: (respError) => {
          this._snackBar.open(respError, 'close', { duration: 2000, panelClass: ['error-snackbar'] });

        }
      })
  }

  getCustomRole() {
    let obj = { ocode: this.currentUser.ocode };
    // console.log(obj);
    this.roleService
      .search(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          // console.log(response);
          let data = JSON.parse(JSON.stringify(response));
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              data[i].defaltFlag = false;
              this.roles.push(data[i]);
            }
          }

          // console.log(this.roles);

        },
        error: (respError) => {
          this._snackBar.open(respError, 'close', { duration: 2000, panelClass: ['error-snackbar'] });

        }
      });
  }

  // getDepartment() {
  //   let obj = { ocode: this.currentUser.ocode }
  //   this.departmentService.search(obj)
  //     .subscribe(
  //       {
  //         next: (response) => {
  //           this.departments = JSON.parse(JSON.stringify(response));
  //           console.log(this.departments);

  //           if (!this.user.department) this.user.department = this.departments[0].name;

  //         },
  //         error: (respError) => {
  //           this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });

  //         }
  //       });
  // };

  // getDesignation() {
  //   let obj = { ocode: this.currentUser.ocode }
  //   this.designationService.search(obj)
  //     .subscribe(
  //       {
  //         next: (response) => {
  //           this.designations = JSON.parse(JSON.stringify(response));
  //           console.log(this.designations);

  //           if (!this.user.designation) this.user.designation = this.departments[0].name;

  //         },
  //         error: (respError) => {
  //           this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });

  //         }
  //       });
  // }




  editUser() {
    this.userService.editData.subscribe(res => {
      // console.log(res);

      if (res) {

        this.user = JSON.parse(JSON.stringify(res));
        // console.log(this.user);

        // console.log(this.contactForm.value);

        this.updateFlag = true;
        this.contactForm.controls['password'].clearValidators();
        this.contactForm.controls['password'].updateValueAndValidity();
        this._changeDetectorRef.markForCheck();
      }
    })
  }


  onAdd() {
    this.saving = true;
    if (this.contactForm.valid) {
      let obj = JSON.parse(JSON.stringify(this.user));
      //console.log(obj);
      // obj.ocode = this.currentUser.ocode;
      // obj.cuserid = this.currentUser.userid;
      if (obj.deparment == 'None') delete obj.deparment;
      if (obj.designation == 'None') delete obj.designation;
      // console.log(obj);

      this.userService.create(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: response => {
            let data = JSON.parse(JSON.stringify(response));
            this.saving = false;
            this.userService.addItem(data)
            // this.store.dispatch(addUser({ user: data }));
            // console.log(response);
            this.cancel();
            this._snackBar.open('One User added successfully.', '', { duration: 3000, panelClass: 'success-snackbar' });
          },
          error: respError => {
            this.saving = false;
            this._snackBar.open('Username exists', '', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        })
    }
  }

  onUpdate() {
    this.saving = true;
    if (!this.user.firstname) {
      this.saving = false;
      this._snackBar.open('Enter Users Firstname', '', { duration: 3000, panelClass: ['error-snackbar'] });
      return;
    }

    // if (!this.user.mobile) {
    //   this.saving = false;
    //   this._snackBar.open('Enter a Users Mobile No.', '', { duration: 3000, panelClass: ['error-snackbar'] });
    //   return;
    // }
    // console.log('update', this.user);
    // console.log('update', this.contactForm.valid);
    if (this.contactForm.valid) {
      let obj = JSON.parse(JSON.stringify(this.user));
      delete obj.password;
      delete obj.created_at;
      //  obj.cuserid = this.currentUser.userid;
      let imageUrl = obj.imageUrl;
      delete obj.imageUrl;
      // console.log(obj);

      this.userService.update(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: response => {
            // console.log(response);
            if (response) {
              this.saving = false;
              this.user = JSON.parse(JSON.stringify(response));
              // this.user.imageUrl = imageUrl;
              this.userService.updateItem(response)
              //this.store.dispatch(updateUser({ user: this.user }));
              this._snackBar.open('One User Updated Successfully.', '', { duration: 3000, panelClass: ['success-snackbar'] });
              this.cancel();
              // this.commonService.setItem('currentUser', this.user);
            }
          },
          error: respError => {
            this.saving = false;
            this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        })
    }
  }

  // cancel() {
  //   this.addFlag = false;
  //   this.editFlag = false;
  //   this.updateFlag = false;
  //   this.user = { firstname: '', lastname: '', mobile: '', email: '', imageUrl: '', role: '', password: '' };
  //   this.userService.editData.next(undefined);
  //   this.UsersComponent.matDrawer1.close()
  // }


  cancel() {
    this.matDialogRef.close();
  }

}
