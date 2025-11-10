import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    buttonText = 'VERIFY AND RESET';
    resetting = false;
    user = { userid: '' };
    success = false;
    userDetails: any;
    private _unsubscribeAll: Subject<any> = new Subject();
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private userService: UserService,
        private commonService: CommonService,
        private router: Router,
        // private _snackBar: MatSnackBar
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    resetPassword() {
        this.resetting = true;
        this.buttonText = 'VERIFYING';
        if (this.userDetails) this.reset(this.userDetails);
        else this.checkUserAccount();
    }

    checkUserAccount() {
        // console.log(this.user);

        let obj = JSON.parse(JSON.stringify(this.user));
        this.userService.showUser(obj.userid)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                // console.log(response);
                this.userDetails = JSON.parse(JSON.stringify(response));
                if (this.userDetails.image) this.userDetails['imageUrl'] = this.userService.profilePic(this.userDetails.image);
                this.buttonText = 'RESET PASSWORD';
                //this.reset(this.userDetails);
            },
                respError => {
                    //  this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error'});
                    this.showAlert = true;
                    this.alert = {
                        type: 'error',
                        message: `This email is not registerd`,
                    }
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 3000);
                    this.resetting = false;
                    this.buttonText = 'VERIFY AND RESET';
                })
    }

    reset(user: any) {
        this.buttonText = 'RESETTING PASSWORD';
        this.userService.resetPassword(user)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                // console.log(response);
                this.resetting = false;
                this.buttonText = 'VERIFY AND RESET';
                this.router.navigateByUrl('confirmation-required');
            },
                respError => {
                    // this._snackBar.open(respError, '', { duration: 3000, panelClass: 'error'});
                    this.resetting = false;
                    this.buttonText = 'VERIFY AND RESET';
                })
    }

    cancel() {
        this.userDetails = undefined;
        this.buttonText = 'VERIFY AND RESET';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */

}
