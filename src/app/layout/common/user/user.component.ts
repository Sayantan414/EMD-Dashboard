import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { User } from 'app/core/user/user.types';
import { CommonService } from 'app/services/common.service';
import { RoleService } from 'app/services/role.service';
import { UserService } from 'app/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, NgIf, MatIconModule, NgClass, MatDividerModule],
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: any;
    currentUser: any;
    showUserName = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private userService: UserService,
        private commonService: CommonService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private roleService: RoleService,


    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened if
                if (matchingAliases.includes("lg")) {
                    this.showUserName = true;
                } else {
                    this.showUserName = false;
                }
            });

        this.user = this.commonService.getItem('currentUser');
        if (this.user) {
            this.currentUser = JSON.parse(JSON.stringify(this.user));
            this.user.imageUrl = this.userService.profilePic(this.user['image']);
            this.currentUser.imageUrl = this.userService.profilePic(this.user['image']);
            // if (this.currentUser.ocode) this.getOrganizationData();
            // else this.organizationData = undefined;
        }
        // Subscribe to user changes


        this.getUserFromStore();
    }

    getUserFromStore() {
        this.commonService.currentUser
            .subscribe(response => {
                // console.log(response);
                // alert('1')
                this.user = JSON.parse(JSON.stringify(response));
                this.currentUser = JSON.parse(JSON.stringify(response));
                this.user.imageUrl = this.userService.profilePic(this.user['image']);
                this.currentUser.imageUrl = this.userService.profilePic(this.user['image']);
                this._changeDetectorRef.markForCheck();
            })

    }

    getUserFromStorage() {
        let user = this.commonService.getItem('currentUser');
        // console.log(user);
        if (user) this.commonService.currentUser.next(user)
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */


    /**
     * Sign out
     */
    signOut(): void {
        let authUser = this.commonService.getItem('currentUser');
        this.userService.signout(authUser)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                this.commonService.removeAll();
                this.commonService.clearStore();
                localStorage.clear();
                this.commonService.removeAll();
                this.roleService.rolelist.next([]);
                this.userService.userlists.next([]);

                this.clearCachedData();
                this.ngOnDestroy();
                this._router.navigate(['/sign-out']);
            })


    }



    clearCachedData() {
        this.userService.clearCachedData().subscribe(Response => {
            // console.log(Response);
        })
    }

    viewUser() {
        this._router.navigate(['/profile']);
        this._changeDetectorRef.markForCheck();
    }
}
