import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectCommonModule } from 'app/core/project-common-modules/project-common.module';
import { UserService } from 'app/services/user.service';
import _ from 'lodash';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ProjectCommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  resetForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  user: any;

  constructor(
    public matDialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private fb: FormBuilder,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {
    this.user = JSON.parse(JSON.stringify(_data.user))
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') this.showPassword = !this.showPassword;
    if (field === 'confirmPassword') this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      let obj = JSON.parse(JSON.stringify(this.user));
      obj['password'] = this.resetForm.get('password')?.value;
      this.userService.updatePassword(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe({
          next: response => {
            // console.log(response);
            if (response) {

              //this.store.dispatch(updateUser({ user: this.user }));
              this._snackBar.open('Password Reset Successful!.', '', { duration: 3000, panelClass: ['success-snackbar'] });
              this.resetForm.reset();
              this.matDialogRef.close();
              // this.commonService.setItem('currentUser', this.user);
            }
          },
          error: respError => {
            // this.saving = false;
            this._snackBar.open(respError, '', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        })
      // console.log('Password Reset Successful!', this.resetForm.value);

    }
  }

  closeModal() {
    // console.log('Modal Closed');
  }
}