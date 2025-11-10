import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'app/services/user.service';
import { CommonService } from 'app/services/common.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanActivateChild, CanLoad {
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private userService: UserService,
        private commonService: CommonService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return this._check('/');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @private
     */
    /* private _check(): Observable<boolean> {
        let authUser = this.commonService.getItem('currentUser');
        if (!authUser) return of(true);
        return this.userService.verifyToken(authUser)
            .pipe(switchMap((authenticated) => {

                // If the user is authenticated...
                if (authenticated) {
                    // Redirect to the root
                    this._router.navigate(['']);

                    // Prevent the access
                    return of(false);
                }

                // Allow the access
                return of(true);
            })
            );
    } */
    private _check(redirectURL: string): Observable<boolean> {
        // console.log(redirectURL);

        let authUser = this.commonService.getItem('currentUser');
        // console.log(authUser);

        //let navigation = this.commonService.getItem('navigation');


        return of(true);

    }
}
