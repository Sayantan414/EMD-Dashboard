import { Route } from "@angular/router";
import { initialDataResolver } from "app/app.resolvers";
import { AuthGuard } from "app/core/auth/guards/auth.guard";
import { NoAuthGuard } from "app/core/auth/guards/noAuth.guard";
import { LayoutComponent } from "app/layout/layout.component";
import { ClassyLayoutComponent } from "./layout/layouts/vertical/classy/classy.component";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
  // Redirect empty path to 'overview'
  { path: '', pathMatch: 'full', redirectTo: 'overview' },

  // Redirect signed-in users to overview
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'overview' },

  // ------------------------------
  // Public (unauthenticated) routes
  // ------------------------------
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: { layout: 'empty' },
    children: [
      { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
      { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
      { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
      { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
      { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
    ],
  },

  // ------------------------------
  // Authenticated routes
  // ------------------------------
  {
    path: "",
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    component: LayoutComponent,
    children: [

      // ---- Overview ----
      {
        path: 'overview',
        loadChildren: () => import('app/modules/Overviwe/overview.routes').then(m => m.default),
      },


      // ---- Dashboard ----
      // {
      //   path: 'area',
      //   loadChildren: () => import('app/modules/Area/area.routes'),
      // },

      // ---- Gas Balance (parent) ----
      {
        path: 'gasbalance',
        children: [
          {
            path: 'cob11',
            loadChildren: () => import('app/modules/Gas_balance/cob11/cob11.routes'),
          },
          // {
          //   path: 'bf',
          //   loadChildren: () => import('app/modules/Gas_balance/bf/bf.routes'),
          // },
          // {
          //   path: 'bofg',
          //   loadChildren: () => import('app/modules/Gas_balance/bofg/bofg.routes'),
          // },
          // {
          //   path: 'mills',
          //   loadChildren: () => import('app/modules/Gas_balance/mills/mills.routes'),
          // },
          // {
          //   path: 'cbm',
          //   loadChildren: () => import('app/modules/Gas_balance/cbm/cbm.routes'),
          // },
          // {
          //   path: 'agbs',
          //   loadChildren: () => import('app/modules/Gas_balance/agbs/agbs.routes'),
          // },
        ],
      },

      // ---- Reports ----
      {
        path: 'settings',
        loadChildren: () => import('app/modules/settings/settings.routes'),
      },
    ],
  },

  // Landing routes
  {
    path: "",
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "home",
        loadChildren: () => import("app/modules/landing/home/home.routes"),
      },
    ],
  },



];
