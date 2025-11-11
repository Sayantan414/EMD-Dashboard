import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/services/common.service';
import { RoleService } from 'app/services/role.service';
import { UserService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [MaterialModule, RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    private _unsubscribeAll: Subject<any> = new Subject();


    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    // alert: { type: FuseAlertType; message: string } = {
    //     type: 'success',
    //     message: ''
    // };
    // signInForm: FormGroup;
    // showAlert: boolean = false;
    signingin = false;
    signinButtontext = 'LOGIN';
    user = { userid: '', password: '' };
    coverUrl = '';
    imageIndex: number;
    maxImages: number;


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private commonService: CommonService,
        private userService: UserService,
        private roleService: RoleService,
        private _snackBar: MatSnackBar
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.coverUrl = 'assets/images/digiimg.jpg';
        // Change background image at regular intervals
        setInterval(() => {
            this.imageIndex = (this.imageIndex % this.maxImages) + 1;
            const background = document.querySelector('.background');

            if (background) {
                background.classList.remove('fade-in');
                setTimeout(() => {
                    this.coverUrl = 'assets/images/pages/signin-bg/' + this.commonService.getRandom(1, 5) + '.jpg';
                    //  background.classList.add(`bg-image-${this.imageIndex}`);
                    background.classList.add('fade-in');
                }, 100);
            }
        }, 30000); // Change every 30 seconds (adjust as needed)
        // Create the form
        this.signInForm = this._formBuilder.group({
            userid: ['', [Validators.required]],
            password: ['', Validators.required],
            // rememberMe: [''],
        });
    }

    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Hide the alert
        this.showAlert = false;

        this.userService.signin(this.signInForm.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    let currentUser = JSON.parse(JSON.stringify(response));
                    console.log(currentUser);


                    if (!currentUser.features) {
                        this.commonService.getFeatures()
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe({
                                next: (data: any) => {
                                    console.log(data);

                                    let features = JSON.parse(JSON.stringify(data));
                                    let newdata = [];
                                    if (features.length > 0) {
                                        for (let i = 0; i < features.length; i++) {
                                            newdata.push(features[i].name);
                                        }
                                        currentUser.features = newdata;
                                    }
                                    this.commonService.currentUser.next(currentUser);
                                    this.getRoles(currentUser);
                                },
                                error: (dataError) => {
                                    // Handle error fetching features (optional)
                                    console.error('Error fetching features:', dataError);
                                }
                            });
                        console.log("hiii");

                    }
                    else {
                        console.log("hello");

                        this.commonService.setItem('currentUser', response);
                        this.commonService.currentUser.next(response);
                        this.getRoles(currentUser);
                    }
                },
                error: (respError) => {
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: respError
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            });
    }



    getRoles(user: any) {

        this.commonService
            .getDefaultRole()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                let defaultRoles = JSON.parse(JSON.stringify(response));
                console.log(response);
                let index = defaultRoles.map((item) => item.name).indexOf(user.role);
                if (index >= 0) {
                    // this.store.dispatch(new SetUserRoleAction(defaultRoles[index]));
                    this.commonService.setItem("currentRole", defaultRoles[index]);
                    this.redirectToDashboad(user, defaultRoles[index]);
                }
                //else this.getCustomRole(user);
            });


    }



    navigateByUrl() {
        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
        this._router.navigateByUrl(redirectURL);
    }

    redirectToDashboad(currentUser: any, role: any) {
        this.signingin = false;
        this.signinButtontext = "LOGIN";
        if (currentUser.onetime) {
            this._router.navigateByUrl("reset-password");
        }
        // else {
        //     if (role.privilege.indexOf('Overview') >= 0){
        //         //Redirect to App Dashboard
        //         this._router.navigate(['plantoverview']);
        //     }
        else {
            //Redirect to Dashboard
            // alert('Login Successful');
            //   const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
            // this._router.navigate(["overview"]);
            this._router.navigate(['/overview']).then(result => {
                console.log('Navigation result:', result);
            }).catch(err => console.error('Navigation error:', err));

            // this._router.navigateByUrl(redirectURL);
        }
        //}
    }

    forgotPassword() {
        console.count();
    }
}
