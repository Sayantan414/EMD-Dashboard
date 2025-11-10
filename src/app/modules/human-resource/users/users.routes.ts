import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserService } from 'app/services/user.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';



const routes: Routes = [
    {
        path: '',
        component: UsersComponent,

    },
];

export default routes;